package fs.human.yk2hyeong.admin.service;

import fs.human.yk2hyeong.admin.dao.AdminDAO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.stereotype.Service;

import java.util.List;

// 관리자 서비스 구현
@Service
public class AdminServiceImpl implements AdminService {

    private final AdminDAO adminDAO;

    public AdminServiceImpl(AdminDAO adminDAO) {
        this.adminDAO = adminDAO;
    }

    @Override
    public List<ProductVO> getPendingProduct() {
        return adminDAO.selectPendingProduct();
    }
}
