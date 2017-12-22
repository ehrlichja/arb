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

val df = spark.read.format("com.databricks.spark.csv").option("header", "false").schema(schema).load(s"$date/").cache()
println(s"Converting ${df.count()} rows...")
df.write.parquet(s"p_$date")
