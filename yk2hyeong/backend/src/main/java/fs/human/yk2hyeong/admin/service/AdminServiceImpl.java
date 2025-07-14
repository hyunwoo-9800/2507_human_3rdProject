package fs.human.yk2hyeong.admin.service;

import fs.human.yk2hyeong.admin.dao.AdminDAO;
import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

// 관리자 서비스 구현
@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminDAO adminDAO;


    @Override
    public List<ProductVO> getPendingProduct() {
        System.out.println("[AdminServiceImpl] getPendingProduct 호출됨");

        List<ProductVO> list = adminDAO.selectPendingProduct();


        if (list == null) {
            System.out.println("[AdminServiceImpl] DAO에서 null 반환됨");
        } else {
            System.out.println("[AdminServiceImpl] 조회된 상품 개수: " + list.size());
            for (ProductVO item : list) {
                System.out.println("상품명: " + item.getProductName());
            }
        }
        return list;

    }
    @Override
    public List<AdminVO> getPendingMember() {
        System.out.println("[AdminServiceImpl] getPendingMember 호출됨");

        List<AdminVO> list = adminDAO.selectPendingMember();
        if (list == null) {
            System.out.println("[AdminServiceImpl] DAO에서 null 반환됨");
        } else {
            System.out.println("[AdminServiceImpl] 조회된 유저 수: " + list.size());
            for (AdminVO item : list) {
                System.out.println("상품명: " + item.getMemberName());
            }
        }
        return list;
    }

    @Transactional
    @Override
    public List<AdminVO> getReport() {
        System.out.println("[AdminServiceImpl] getReport 호출됨");

        List<AdminVO> list = adminDAO.selectReport();
        if (list == null) {
            System.out.println("[AdminServiceImpl] DAO에서 null 반환됨");
        } else {
            System.out.println("[AdminServiceImpl] 조회된 신고 수: " + list.size());
            for (AdminVO item : list) {
                System.out.println("신고자명: " + item.getReporterName());
            }
        }
        return list;
    }

    @Override
    public List<AdminVO> getMember() {
        System.out.println("[AdminServiceImpl] getMember 호출됨");

        List<AdminVO> list = adminDAO.selectMember();
        if (list == null) {
            System.out.println("[AdminServiceImpl] DAO에서 null 반환됨");
        } else {
            System.out.println("[AdminServiceImpl] 조회된 멤버 수: " + list.size());
            for (AdminVO item : list) {
                System.out.println("멤버명: " + item.getMemberName());
            }
        }
        return list;
    }

    //이미지 불러오기
    @Override
    public List<ProductImageVO> getProductImages(String productId){
        List<ProductImageVO> images = adminDAO.getProductImages(productId);
        System.out.println("[AdminServiceImpl] 조회된 이미지 개수: " + images.size());
        return adminDAO.getProductImages(productId);
    }

//    게시글 삭제
    @Override
    public void deleteReport(List<String> reportId){
        adminDAO.deleteReport(reportId);
    }

    @Override
    public void deleteMember(List<String> reportId){
        adminDAO.deleteReport(reportId);
    }


}
