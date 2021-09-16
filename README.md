#  ClickHeus
#### ClickHouse Custom Metrics Exporter for Prometheus

_What if you could just run ClickHouse recurring queries and aggregate their results as Prometheus metrics?_

ClickHeus allows cross linking of multiple recurring `queries` and `metric buckets` using custom `labels` and `values`.

<img src=https://user-images.githubusercontent.com/1423657/62568240-0e389700-b88d-11e9-8e7d-16d84be08ae9.png width=500>



### Configuration

Clickheus acts according to the parameters configured in its `config.js` file.

### Usage Example

The following example illustrates mapping of `clickhouse` query columns to metric labels and values.

#### 1) Choose a Clickhouse Datasource
Let's use the following fictional `my_index` table as our datasource:

|datetime  |status   |group   |
|---|---|---|
| 1631825843  | FINISHED  | default  |
| 1631825844  | FAILED    | default  |
| 1631825845  | FINISHED  | default  |
| 1631825846  | FAILED    | custom   |
| 1631825847  | FINISHED  | default  |
| ...         | ...       | ...      |

#### 2) Define a Metrics Bucket
Using the `prom_metrics` array, define and name new `bucket` and its definitions. 
- Type can be `gauge` or `histogram`
- LabelNames should match the target tag columns
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

#### 3) Define a Clickhouse Query
Using the `queries` array, define a `clickhouse` query to execute and associate it with metrics bucket `g`
- Place your tags first in the query
- Place your metric value last, and mark its position using the `counter_position` parameter _(count from 0)_.
- Match the refresh rate in milliseconds to match the query range _(ie: 60 seconds)_
- 
```
"queries":[
   {
      "name":"my_status",
      "query":"SELECT status, group, count(*) FROM my_index FINAL PREWHERE (datetime >= toDateTime(now()-60)) AND (datetime < toDateTime(now()) ) group by status, group",
      "counter_position":2,
      "refresh":60000,
      "metrics":[
         "g"
      ]
   }
],
```

#### 4) Output Metrics
Connect to the configured `/metrics` HTTP endpoint defined in your configuration and await data
```
# HELP my_count My Counter
# TYPE my_count gauge
my_count{status="FINISHED",group="default"} 10
```


---------

## Credits
This project is sponsored by [QXIP BV](https://github.com/qxip) and [HEPIC](http://hepic.tel)

