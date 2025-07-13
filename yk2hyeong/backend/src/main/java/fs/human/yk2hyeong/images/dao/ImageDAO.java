package fs.human.yk2hyeong.images.dao;

import fs.human.yk2hyeong.images.vo.ImageVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

/**
 * 이미지 DAO 인터페이스
 *
 * 이 인터페이스는 이미지 관련 데이터베이스 작업을 처리하는 DAO의 계약을 정의합니다.
 * 이미지를 데이터베이스에 삽입하거나, 이미지와 관련된 회원 ID를 업데이트하는 작업을 수행합니다.
 * MyBatis를 사용하여 SQL 쿼리와 매핑됩니다.
 *
 * @author 조현우
 * @since 2025-07-13
 */
@Mapper
public interface ImageDAO {

    /**
     * 이미지를 데이터베이스에 삽입하는 메서드
     *
     * 이 메서드는 전달된 `ImageVO` 객체의 정보를 데이터베이스에 삽입합니다.
     * 이미지 정보는 `imageId`, `imagePath`, `imageName`, `imageType`, `memberId` 등으로 구성됩니다.
     *
     * @param imageVO 삽입할 이미지 정보
     * @throws DataAccessException 데이터베이스 작업 중 오류가 발생하면 발생하는 예외
     */
    void insertImage(ImageVO imageVO) throws DataAccessException;

    /**
     * 이미지의 회원 ID를 업데이트하는 메서드
     *
     * 이 메서드는 이미지에 연결된 회원 ID를 업데이트합니다. 주로 이미지가 회원과 연결될 때 사용됩니다.
     * 이미지의 `memberId` 값을 특정 회원 ID로 갱신합니다.
     *
     * @param imageId 이미지 고유 ID
     * @param memberId 업데이트할 회원 ID
     * @throws DataAccessException 데이터베이스 작업 중 오류가 발생하면 발생하는 예외
     */
    void updateImageMemberId(String imageId, String memberId) throws DataAccessException;

}
