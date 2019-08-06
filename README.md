
# ClickHouse Metrics for Prometheus
Sample NodeJS application exposing ClickHouse queries as Prometheus metrics

## What?
This small tool will execute `clickhouse` queries and publish their results as `prometheus` metrics.

### Status
* Work in progress. Do not use this!

### Example
The following example illustrates mapping of `clickhouse` query columns to metric labels and values
#### Queries
```
"queries":[
		{
			"name": "call_status",
			"query": "SELECT status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out, count(*) FROM sip_transaction_call FINAL PREWHERE record_datetime BETWEEN toDateTime(now()-60000)  AND toDateTime(now()) AND cdr_stop BETWEEN multiply(toUInt64(toDateTime(NOW()-60)), 1000000) AND toUInt64(toDateTime(NOW())) * 1000000 group by status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out",
			"labels": ["status", "xgroup", "ipgroup_in", "ipgroup_out", "usergroup", "server_type_in", "server_type_out"],
			"counter_position": 7,
			"refresh": 60000,
			"metrics": ["g"]
		},
		{
			"name": "call_seconds",
			"query": "SELECT status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out, sum(duration) FROM sip_transaction_call FINAL PREWHERE status = 10 AND record_datetime BETWEEN toDateTime(now()-60000)  AND toDateTime(now()) AND cdr_stop BETWEEN multiply(toUInt64(toDateTime(NOW()-60)), 1000000) AND toUInt64(toDateTime(NOW())) * 1000000 group by status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out",
			"labels": ["status", "xgroup", "ipgroup_in", "ipgroup_out", "usergroup", "server_type_in", "server_type_out"],
			"counter_position": 7,
			"refresh": 60000,
			"metrics": ["s"]
		}
	],
```
#### Metrics
```
# HELP hepic_click_trans_count hepic transaction Count
# TYPE hepic_click_trans_count gauge
hepic_click_trans_count{status="FINISHED",xgroup="default",ipgroup_in="default",ipgroup_out="default",usergroup="default",server_type_in="default",server_type_out="default"} 1

# HELP hepic_click_second_count hepic call second Count
# TYPE hepic_click_second_count gauge
hepic_click_second_count{status="FINISHED",xgroup="default",ipgroup_in="default",ipgroup_out="default",usergroup="default",server_type_in="default",server_type_out="default"} 37
```
