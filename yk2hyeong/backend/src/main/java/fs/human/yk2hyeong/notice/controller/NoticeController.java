package fs.human.yk2hyeong.notice.controller;

import fs.human.yk2hyeong.notice.service.NoticeService;
import fs.human.yk2hyeong.notice.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NoticeController {

    private final NoticeService noticeService;

    // 전체 공지사항 목록 조회
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

    // 공지사항 단건 조회
    @GetMapping("/{id}")
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

    // 공지사항 등록
    @PostMapping
    public ResponseEntity<?> insertNotice(@RequestBody NoticeVO vo) {
        try {
            noticeService.insertNotice(vo);
            return ResponseEntity.ok("공지사항이 등록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 등록 중 오류 발생");
        }
    }

    // 공지사항 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotice(@PathVariable("id") String noticeId, @RequestBody NoticeVO vo) {
        try {
            vo.setNoticeId(noticeId);
            noticeService.updateNotice(vo);
            return ResponseEntity.ok("공지사항이 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 수정 중 오류 발생");
        }
    }

    // 공지사항 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable("id") String noticeId) {
        try {
            noticeService.deleteNotice(noticeId);
            return ResponseEntity.ok("공지사항이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("공지사항 삭제 중 오류 발생");
        }
    }
}
