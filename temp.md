SELECT
    g.id AS track_id,
    g.gpu_id,
    g.name AS counter_name,
    g.unit,
    COUNT(c.id) AS sample_count
FROM gpu_counter_track AS g
LEFT JOIN counter AS c
    ON c.track_id = g.id
WHERE g.gpu_id = 0
GROUP BY g.id, g.gpu_id, g.name, g.unit
ORDER BY g.id;



-- 自动生成 GPU 0 全部 Counters 的宽表查询
SELECT
    'SELECT ROUND((c.ts - b.start_ts) / 1e9, 9) AS time_s, ' ||

    (
        SELECT GROUP_CONCAT(
            'MAX(CASE WHEN c.track_id = ' || x.id ||
            ' THEN c.value END) AS "' ||
            REPLACE(
                x.name || ' [track_' || x.id || ']',
                '"', '""'
            ) ||
            '"',
            ', '
        )
        FROM (
            SELECT
                g.id,
                COALESCE(g.name, 'Unnamed Counter') ||
                CASE
                    WHEN g.unit IS NOT NULL AND g.unit <> ''
                    THEN ' (' || g.unit || ')'
                    ELSE ''
                END AS name
            FROM gpu_counter_track AS g
            WHERE g.gpu_id = 0
              AND EXISTS (
                  SELECT 1
                  FROM counter AS c
                  WHERE c.track_id = g.id
              )
            ORDER BY g.id
        ) AS x
    ) ||

    ' FROM counter AS c CROSS JOIN trace_bounds AS b ' ||
    'WHERE c.track_id IN (' ||
    'SELECT id FROM gpu_counter_track WHERE gpu_id = 0) ' ||
    'GROUP BY c.ts ORDER BY c.ts;'

AS generated_sql;
