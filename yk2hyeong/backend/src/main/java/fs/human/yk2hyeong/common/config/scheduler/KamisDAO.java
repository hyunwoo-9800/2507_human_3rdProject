package fs.human.yk2hyeong.common.config.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class KamisDAO {

    private final JdbcTemplate jdbcTemplate;

    public boolean isEmpty() {

        Integer count = jdbcTemplate.queryForObject(

                "SELECT COUNT(*) FROM TB_PRICE_API_HISTORY",
                Integer.class

        );

        return count == null || count == 0;

    }

}
