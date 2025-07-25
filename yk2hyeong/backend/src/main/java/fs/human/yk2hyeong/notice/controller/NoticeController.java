package fs.human.yk2hyeong.notice.controller;

import fs.human.yk2hyeong.index.vo.IndexVO;
import fs.human.yk2hyeong.member.vo.MemberVO;
import fs.human.yk2hyeong.notice.service.NoticeService;
import fs.human.yk2hyeong.notice.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController                                 // REST API 컨트롤러로 설정
@RequestMapping("/notice")                      // 요청 URL prefix 설정: /notice 로 시작
@RequiredArgsConstructor                        // 생성자 주입 자동 생성
@CrossOrigin(origins = "http://localhost:3000") // React 포트와 연동 위해 CORS 허용
public class NoticeController {

    // 공지사항 서비스 의존성 주입
    private final NoticeService noticeService;

    // 전체 공지사항 목록 조회 API
    @GetMapping("/all")
    public ResponseEntity<?> getAllNotices() {

        try {

            List<NoticeVO> list = noticeService.getAllNotices(); // 전체 조회
            return ResponseEntity.ok(list); // 조회 성공 시 200 OK + 데이터

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 목록 조회 중 오류 발생");  // 조회 실패 시 500 에러

        }

    }

    // 공지사항 상세 조회 API
    @GetMapping("/{id}")
    public ResponseEntity<?> getNoticeById(@PathVariable("id") String noticeId) {

        try {

            NoticeVO notice = noticeService.getNoticeById(noticeId);    // ID로 단일 조회

            if (notice == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 공지사항이 존재하지 않습니다.");
            }

            return ResponseEntity.ok(notice);   // 조회 성공 시 데이터 반환

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 조회 중 오류 발생");

        }

    }

    // 공지사항 등록 API
    @PostMapping
    public ResponseEntity<?> insertNotice(
            @AuthenticationPrincipal MemberVO member,
            @RequestBody Map<String, Object> params) {

        if (member == null || !"001".equals(member.getMemberRole())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 필요합니다.");

        }

        try {

            // VO 객체 생성 및 값 세팅
            NoticeVO vo = new NoticeVO();
            vo.setNoticeId((String) params.get("noticeId"));
            vo.setNoticeTitle((String) params.get("noticeTitle"));
            vo.setNoticeContent((String) params.get("noticeContent"));
            vo.setWriterId(member.getMemberId());
            vo.setCreatedId(member.getMemberId());

            // 서비스로 전달
            noticeService.insertNotice(vo);
            return ResponseEntity.ok("공지사항이 등록되었습니다.");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 등록 중 오류 발생");

        }

    }

    // 공지사항 수정 API
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotice(
            @PathVariable("id") String noticeId,
            @AuthenticationPrincipal MemberVO member,
            @RequestBody Map<String, Object> params) {

        if (member == null || !"001".equals(member.getMemberRole())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 필요합니다.");

        }

        try {

            NoticeVO vo = new NoticeVO();
            vo.setNoticeId(noticeId);   // URL로 받은 ID 우선 사용
            vo.setNoticeTitle((String) params.get("noticeTitle"));
            vo.setNoticeContent((String) params.get("noticeContent"));
            vo.setWriterId(member.getMemberId());
            vo.setUpdatedId(member.getMemberId());

            noticeService.updateNotice(vo);
            return ResponseEntity.ok("공지사항이 수정되었습니다.");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 수정 중 오류 발생");

        }

    }

    // 공지사항 삭제 API
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(
            @PathVariable("id") String noticeId,
            @AuthenticationPrincipal MemberVO member) {

        if (member == null || !"001".equals(member.getMemberRole())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 필요합니다.");

        }

        try {

            noticeService.deleteNotice(noticeId);
            return ResponseEntity.ok("공지사항이 삭제되었습니다.");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 삭제 중 오류 발생");

        }

    }
    //footer 공지사항
    @GetMapping("/latest")
    public NoticeVO getLatestNotice() {
        return noticeService.getLatestNotice();
    }

}
