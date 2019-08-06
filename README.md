
# ClickHouse Metrics for Prometheus
Sample NodeJS application exposing ClickHouse queries as Prometheus metrics

## What?
This small tool will execute `clickhouse` queries and publish their results as `prometheus` metrics.

```
# HELP hepic_click_trans_count hepic transaction Count
# TYPE hepic_click_trans_count gauge
hepic_click_trans_count{status="FINISHED",xgroup="default",ipgroup_in="default",ipgroup_out="default",usergroup="default",server_type_in="default",server_type_out="default"} 1

# HELP hepic_click_second_count hepic call second Count
# TYPE hepic_click_second_count gauge
hepic_click_second_count{status="FINISHED",xgroup="default",ipgroup_in="default",ipgroup_out="default",usergroup="default",server_type_in="default",server_type_out="default"} 37
```


![image](https://user-images.githubusercontent.com/1423657/62362946-66cf0380-b51e-11e9-8189-c002d15a6bab.png)

