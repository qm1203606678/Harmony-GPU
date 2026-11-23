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





-- GPU Counters Track Details 批量导出
-- 每行对应一个 Counter

WITH counter_stats AS (
    SELECT
        c.track_id,
        COUNT(*) AS sample_count,
        MIN(c.value) AS min_value,
        MAX(c.value) AS max_value,
        AVG(c.value) AS avg_value,
        MIN(c.ts) AS first_ts,
        MAX(c.ts) AS last_ts
    FROM counter c
    WHERE c.track_id IN (
        SELECT id FROM gpu_counter_track
    )
    GROUP BY c.track_id
),
counter_groups AS (
    SELECT
        gg.track_id,
        GROUP_CONCAT(
            DISTINCT COALESCE(
                NULLIF(gg.name, ''),
                CASE gg.group_id
                    WHEN 0 THEN 'General Counters'
                    WHEN 1 THEN 'System Counters'
                    WHEN 2 THEN 'Vertex Counters'
                    WHEN 3 THEN 'Fragment Counters'
                    WHEN 4 THEN 'Primitive Counters'
                    WHEN 5 THEN 'Memory Counters'
                    WHEN 6 THEN 'Compute Counters'
                    WHEN 7 THEN 'Ray Tracing Counters'
                    ELSE 'Other Counters'
                END
            )
        ) AS counter_group
    FROM gpu_counter_group gg
    GROUP BY gg.track_id
)
SELECT
    g.id AS track_id,
    g.name AS counter_name,
    COALESCE(
        cg.counter_group,
        'General Counters'
    ) AS counter_group,
    g.unit AS unit,
    g.description AS description,
    g.type AS track_type,
    g.parent_id,
    g.source_arg_set_id,

    COALESCE(s.sample_count, 0) AS sample_count,
    s.min_value,
    s.max_value,
    ROUND(s.avg_value, 6) AS avg_value,

    ROUND(
        (s.first_ts - b.start_ts) / 1e9, 6
    ) AS first_sample_s,

    ROUND(
        (s.last_ts - b.start_ts) / 1e9, 6
    ) AS last_sample_s

FROM gpu_counter_track g
LEFT JOIN counter_stats s
    ON g.id = s.track_id
LEFT JOIN counter_groups cg
    ON g.id = cg.track_id
CROSS JOIN trace_bounds b

ORDER BY counter_group, g.name, g.id;
