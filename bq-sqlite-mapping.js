
// Mapping of BigQuery column types to SQLite column types (list from https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types)
/*
ARRAY 	The sum of the size of its elements. For example, an array defined as (ARRAY<INT64>) that contains 4 entries is calculated as 32 logical bytes (4 entries x 8 logical bytes).
BIGNUMERIC 	32 logical bytes
BOOL 	1 logical byte
BYTES 	2 logical bytes + the number of logical bytes in the value
DATE 	8 logical bytes
DATETIME 	8 logical bytes
FLOAT64 	8 logical bytes
GEOGRAPHY 	16 logical bytes + 24 logical bytes * the number of vertices in the geography type. To verify the number of vertices, use the ST_NumPoints function.
INT64 	8 logical bytes
INTERVAL 	16 logical bytes
JSON 	The number of logical bytes in UTF-8 encoding of the JSON-formatted string equivalent after canonicalization.
NUMERIC 	16 logical bytes
STRING 	2 logical bytes + the UTF-8 encoded string size
STRUCT 	0 logical bytes + the size of the contained fields
TIME 	8 logical bytes
TIMESTAMP 	8 logical bytes
*/

const columnTypes = {
  ARRAY: "TEXT",
  BIGNUMERIC: "TEXT",
  BOOL: "INTEGER",
  BYTES: "TEXT",
  DATE: "TEXT",
  DATETIME: "TEXT",
  FLOAT64: "REAL",
  GEOGRAPHY: "TEXT",
  INT64: "INTEGER",
  INTERVAL: "TEXT",
  JSON: "TEXT",
  NUMERIC: "TEXT",
  STRING: "TEXT",
  STRUCT: "TEXT",
  TIME: "TEXT",
  TIMESTAMP: "TEXT",
};
