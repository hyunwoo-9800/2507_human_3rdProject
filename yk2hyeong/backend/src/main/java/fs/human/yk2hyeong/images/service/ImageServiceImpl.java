package fs.human.yk2hyeong.images.service;

import fs.human.yk2hyeong.common.code.dao.CodeDAO;
import fs.human.yk2hyeong.images.dao.ImageDAO;
import fs.human.yk2hyeong.images.vo.ImageVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageDAO imageDAO;
    private final CodeDAO codeDAO;

    @Override
    public String insertImage(MultipartFile file, String memberIdOrNull) throws Exception {

        try {

            String uuid = UUID.randomUUID().toString();
            String originalName = file.getOriginalFilename();
            String newFileName = uuid + "_" + originalName;
            String saveDir = "C:/yk2hyeong/member_images";
            Files.createDirectories(Paths.get(saveDir));
            Path savePath = Paths.get(saveDir, newFileName);
            file.transferTo(savePath);

            String imgType = codeDAO.getImageLowCodeValue();

            ImageVO image = new ImageVO();
            image.setImagePath(saveDir);
            image.setImageName(newFileName);
            image.setImageType(imgType);
            image.setMemberId(memberIdOrNull);
            image.setProductId(" ");
            image.setCreatedId("SYSTEM");
            image.setCreatedDate(new Date(System.currentTimeMillis()));
            image.setUpdatedId("SYSTEM");
            image.setUpdatedDate(new Date(System.currentTimeMillis()));

            imageDAO.insertImage(image);
            return uuid;

        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패", e);
        }

    }

    @Override
    public void updateImageMemberId(String imageId, String memberId) throws Exception {

        imageDAO.updateImageMemberId(imageId, memberId);

    }

}
