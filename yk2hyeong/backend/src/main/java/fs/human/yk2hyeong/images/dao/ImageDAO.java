package fs.human.yk2hyeong.images.dao;

import fs.human.yk2hyeong.images.vo.ImageVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

@Mapper
public interface ImageDAO {

    void insertImage(ImageVO imageVO) throws DataAccessException;

    void updateImageMemberId(String imageId, String memberId) throws DataAccessException;

}
