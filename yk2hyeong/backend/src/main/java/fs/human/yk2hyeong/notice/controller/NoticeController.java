package fs.human.yk2hyeong.notice.controller;

import fs.human.yk2hyeong.notice.service.NoticeService;
import fs.human.yk2hyeong.notice.vo.NoticeVO;
import fs.human.yk2hyeong.member.vo.MemberVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NoticeController {

    private final NoticeService noticeService;

    // 전체 공지사항 목록 조회 API
    @GetMapping("/all")
    public ResponseEntity<?> getAllNotices() {
        try {
            List<NoticeVO> list = noticeService.getAllNotices();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 목록 조회 중 오류 발생");
        }
    }

    // 공지사항 등록 API
    @PostMapping("/reg")
    public ResponseEntity<?> insertNotice(
            @AuthenticationPrincipal MemberVO member,
            @RequestBody Map<String, Object> params) {

        if (member == null || !"001".equals(member.getMemberRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 필요합니다.");
        }

        try {
            NoticeVO vo = new NoticeVO();
            vo.setNoticeTitle((String) params.get("noticeTitle"));
            vo.setNoticeContent((String) params.get("noticeContent"));
            vo.setWriterId(member.getMemberId());
            vo.setCreatedId(member.getMemberId());
            vo.setUpdatedId(member.getMemberId());

            noticeService.insertNotice(vo);
            return ResponseEntity.ok("공지사항이 등록되었습니다.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 등록 중 오류 발생");
        }
    }

    // 공지사항 상세 조회 API
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getNoticeById(@PathVariable("id") String noticeId) {

        try {

            NoticeVO notice = noticeService.getNoticeById(noticeId);

            if (notice == null) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 공지사항이 존재하지 않습니다.");

            }

            return ResponseEntity.ok(notice);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 조회 중 오류 발생");

        }

    }

    // 공지사항 수정 API
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateNotice(
            @PathVariable("id") String noticeId,
            @AuthenticationPrincipal MemberVO member,
            @RequestBody Map<String, Object> params) {

        if (member == null || !"001".equals(member.getMemberRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 필요합니다.");
        }

        try {
            NoticeVO vo = new NoticeVO();
            vo.setNoticeId(noticeId);
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
    @DeleteMapping("/delete/{id}")
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

    // 최신 공지 1건 (footer용)
    @GetMapping("/latest")
    public NoticeVO getLatestNotice() {
        return noticeService.getLatestNotice();
    }
}
