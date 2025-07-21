package fs.human.yk2hyeong.common.config.scheduler;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
public class KamisScheduler {

    private final KamisDAO kamisDAO; // DB에 접근해서 비었는지 확인할 DAO

    // 최초 실행: 테이블 비었으면 10년치 수집
    @PostConstruct
    public void init() {
        if (kamisDAO.isEmpty()) {

            runPythonWithDate("20150101", "20250719");

        }

    }

    // 매일 자정 실행: 오늘 날짜 수집
    @Scheduled(cron = "0 0 0 * * *")
    public void fetchToday() {

        String yesterday = LocalDate.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        runPythonWithDate(yesterday, yesterday);

    }

    private void runPythonWithDate(String fromDate, String toDate) {

        try {
            // 1. 데이터 수집
            ProcessBuilder pb = new ProcessBuilder("python", "../ai/fetch_data.py", fromDate, toDate);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // 로그 읽기
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8)
            );

            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[PYTHON-FETCH] " + line);
            }

            int exitCode = process.waitFor();
            System.out.println("[Python 수집 종료 코드] " + exitCode);

            // 2. 예측 실행
            ProcessBuilder predict = new ProcessBuilder("python", "../ai/predictor.py");
            predict.redirectErrorStream(true);
            Process predictProcess = predict.start();

            BufferedReader predictReader = new BufferedReader(
                    new InputStreamReader(predictProcess.getInputStream(), StandardCharsets.UTF_8)
            );

            while ((line = predictReader.readLine()) != null) {
                System.out.println("[PYTHON-PREDICT] " + line);
            }

            int predictExit = predictProcess.waitFor();
            System.out.println("[Python 예측 종료 코드] " + predictExit);

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

    }

}
