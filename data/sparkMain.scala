import org.apache.spark.sql.types._
val date = 20171220
val schema = StructType(
  Seq(
    StructField("ts", LongType, true),
    StructField("exchange", StringType, true),
    StructField("tradingPair", StringType, true),
    StructField("orderType", StringType, true),
    StructField("price", DecimalType(20,10), true),
    StructField("amount", DecimalType(20,10), true)
  )
)

val df = spark.read.parquet(s"p_$date")
val pairs = df.select("tradingPair").distinct().collect().map(_.getString(0))
df.groupBy("exchange", "tradingPair", "orderType").count().show()
println(s"Querying pairs $pairs")
println(s"Querying ${df.count()} rows...")
pairs.foreach(pair => {
  val thisDf = df.where($"tradingPair" === pair)
  println(s"Doing pair $pair with ${thisDf.count()} records")
  val arbSQL = """
     SELECT 
          from_unixtime(cast(a.ts/1000 as BIGINT), "yyyMMdd:HHmm") AS ts1,
          from_unixtime(cast(a.ts/1000 as BIGINT), "yyyMMdd:HHmm") AS ts2,
          a.tradingPair, 
          a.exchange AS a_ex, 
          b.exchange AS b_ex, 
          a.orderType AS a_o, 
          b.orderType AS b_o, 
          a.price AS a_price, 
          b.price AS b_price,
          a.amount AS a_amount,
          b.amount AS b_amount,
          ABS(a.price - b.price) AS abs_price_diff,
          a.price * a.amount AS a_cost,
          b.price * b.amount AS b_cost,   
          IF(a.orderType = "SELL", 
              (b.price * CASE WHEN a.amount < b.amount THEN a.amount ELSE b.amount END) - (a.price * CASE WHEN a.amount < b.amount THEN a.amount ELSE b.amount END), 
            (a.price * CASE WHEN a.amount < b.amount THEN a.amount ELSE b.amount END) - (b.price * CASE WHEN a.amount < b.amount THEN a.amount ELSE b.amount END)
          ) AS net_profit
          FROM temp a 
          JOIN temp b 
          ON a.exchange != b.exchange 
          AND a.orderType != b.orderType
          AND from_unixtime(cast(a.ts/1000 as BIGINT), "yyyMMdd:HHmm") = from_unixtime(cast(b.ts/1000 as BIGINT), "yyyMMdd:HHmm")
          ORDER BY net_profit DESC
  """
  thisDf.createOrReplaceTempView("temp")
  spark.sql(arbSQL).show()
})
