package fs.human.yk2hyeong.common.code.controller;

import fs.human.yk2hyeong.common.code.service.CodeService;
import fs.human.yk2hyeong.common.code.vo.CodeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 공통 코드 컨트롤러
@RestController
@RequestMapping("/common")
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;

    // 은행 목록
    @GetMapping("/bank")
    public ResponseEntity<?> getBankName() throws Exception {

        List<CodeVO> bankList = codeService.getBankNameList();
        return ResponseEntity.ok(bankList);

    }

    // 회원 권한 목록
    @GetMapping("/memberRole")
    public ResponseEntity<?> getmemberRole() throws Exception {

        List<CodeVO> roleList = codeService.getRoleList();
        return ResponseEntity.ok(roleList);

    }
    
    // 회원 상태 목록
    @GetMapping("/memberStat")
    public ResponseEntity<?> getmemberStat() throws Exception {

        List<CodeVO> statList = codeService.getMemberStatList();
        return ResponseEntity.ok(statList);

    }

}
