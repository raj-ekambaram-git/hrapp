INSERT INTO Calendar
SELECT TO_CHAR(datum, 'yyyymmdd')::INT AS dateDimId,
       datum AS dateActual,
       EXTRACT(EPOCH FROM datum) AS epoch,
       TO_CHAR(datum, 'fmDDth') AS daySuffix,
       TO_CHAR(datum, 'TMDay') AS dayName,
       EXTRACT(ISODOW FROM datum) AS dayOfWeek,
       EXTRACT(DAY FROM datum) AS dayOfMonth,
       datum - DATE_TRUNC('quarter', datum)::DATE + 1 AS dayOfQuarter,
       EXTRACT(DOY FROM datum) AS dayOfYear,
       TO_CHAR(datum, 'W')::INT AS weekOfMonth,
       EXTRACT(WEEK FROM datum) AS weekOfYear,
       EXTRACT(ISOYEAR FROM datum) || TO_CHAR(datum, '"-W"IW') AS weekOfYearISO,
       EXTRACT(MONTH FROM datum) AS monthActual,
       TO_CHAR(datum, 'TMMonth') AS monthName,
       TO_CHAR(datum, 'Mon') AS monthNameAbbreviated,
       EXTRACT(QUARTER FROM datum) AS quarterActual,
       EXTRACT(YEAR FROM datum) AS yearActual,
       datum + (1 - EXTRACT(ISODOW FROM datum))::INT AS firstDayOfWeek,
       datum + (7 - EXTRACT(ISODOW FROM datum))::INT AS lastDayOfWeek,
       datum + (1 - EXTRACT(DAY FROM datum))::INT AS firstDayOfMonth,
       (DATE_TRUNC('MONTH', datum) + INTERVAL '1 MONTH - 1 day')::DATE AS lastDayOfMonth,
       DATE_TRUNC('quarter', datum)::DATE AS firstDayOfQuarter,
       (DATE_TRUNC('quarter', datum) + INTERVAL '3 MONTH - 1 day')::DATE AS lastDayOfQuarter,
       TO_DATE(EXTRACT(YEAR FROM datum) || '-01-01', 'YYYY-MM-DD') AS firstDayOfYear,
       TO_DATE(EXTRACT(YEAR FROM datum) || '-12-31', 'YYYY-MM-DD') AS lastDayOfYear,
       '{"day1":{"date":"' || datum + (1 - EXTRACT(ISODOW FROM datum))::INT || '"},"day2": {"date":"'||  datum + (2 - EXTRACT(ISODOW FROM datum))::INT ||'"},"day3": {"date":"'||  datum + (3 - EXTRACT(ISODOW FROM datum))::INT ||'"},"day4": {"date":"'|| datum + (4 - EXTRACT(ISODOW FROM datum))::INT||'"},"day5": {"date":"'||datum + (5 - EXTRACT(ISODOW FROM datum))::INT||'"},"day6": {"date":"'|| datum + (6 - EXTRACT(ISODOW FROM datum))::INT||'"},"day7": {"date":"'|| datum + (7 - EXTRACT(ISODOW FROM datum))::INT||'"}}' AS currentWeekDates,       
       TO_CHAR(datum, 'mmyyyy') AS mmyyyy,
       TO_CHAR(datum, 'mmddyyyy') AS mmddyyyy,
       TO_CHAR(datum, 'mm/dd') AS mmdd,
       CASE
           WHEN EXTRACT(ISODOW FROM datum) IN (6, 7) THEN TRUE
           ELSE FALSE
           END AS weekend
FROM (SELECT '2023-01-01'::DATE + SEQUENCE.DAY AS datum
      FROM GENERATE_SERIES(0, 29219) AS SEQUENCE (DAY)
      GROUP BY SEQUENCE.DAY) DQ
ORDER BY 1;

COMMIT;