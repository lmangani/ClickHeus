<img src="https://avatars2.githubusercontent.com/u/27866033?s=200&v=4" width=100>

#  ClickHeus - ClickHouse Custom Metrics Exporter for Prometheus
<img src=https://user-images.githubusercontent.com/1423657/62568240-0e389700-b88d-11e9-8e7d-16d84be08ae9.png width=550>

Simple NodeJS application exposing ClickHouse custom query results as Prometheus metrics. It allows cross linking of multiple `queries` and `metric buckets` with recurring data intervals and simple mapping of `labels` and `values`.


-------------

#### Example

##### Configuration
The following example illustrates mapping of `clickhouse` query columns to metric labels and values.

Configuring an emitter requires the following steps through the included `config.js` file:

###### 1: Define a Metrics Bucket
Using the `prom_metrics` array, define and name new `bucket` and its definitions. Type can be `gauge` or `histogram`
```
"prom_metrics": [
   {
      "name":"g",
      "type":"gauge",
      "settings":{
         "name":"my_count",
         "help":"My Counter",
         "maxAgeSeconds":60,
         "labelNames":[
            "status",
            "group"
         ]
      }
   }
],

```

###### 2: Define a Query
Using the `queries` array, define a new `clickhouse` query to execute and associate it with metrics bucket `g`

Place your value last in your query, and mark its position using the `counter_position` parameter.
```
"queries":[
   {
      "name":"some_status",
      "query":"SELECT status, group, count(*) FROM some_index FINAL PREWHERE (created_at >= toDateTime(now()-60)) AND (created_at < toDateTime(now()) ) group by status, group",
      "counter_position":2,
      "refresh":60000,
      "metrics":[
         "g"
      ]
   }
],
```

###### 3: Output Metrics
Connect to the configured `/metrics` HTTP endpoint defined in your configuration and await data
```
# HELP my_count My Counter
# TYPE my_count gauge
my_count{status="FINISHED",group="default"} 10
```


---------

## Credits
This project is sponsored by [QXIP](https://github.com/qxip) and [HEPIC](http://hepic.tel)
