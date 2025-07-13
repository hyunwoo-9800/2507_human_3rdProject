package fs.human.yk2hyeong.images.service;

import fs.human.yk2hyeong.images.vo.ImageVO;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    String insertImage(MultipartFile file, String memberId) throws Exception;

    void updateImageMemberId(String imageId, String memberId) throws Exception;

}
