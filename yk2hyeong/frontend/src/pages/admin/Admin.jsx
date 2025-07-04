import React, {useState} from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import Card from '../../components/common/Card';
import '../../components/common/common.css';

export default function Admin() {

    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState('1');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    return (
        <div>
            <p>관리자 페이지</p>
            <h1>공통 컴포넌트 테스트</h1>

            {/* Button */}
            <h2>Button</h2>
            <Button onClick={() => alert('버튼 클릭됨!')}>Primary 버튼</Button>
            <Button variant="secondary" onClick={() => alert('서브 버튼')}>Secondary 버튼</Button>

            {/* Input */}
            <h2>Input</h2>
            <Input
                label="이름"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="이름을 입력하세요"
            />

            {/* Select */}
            <h2>Select</h2>
            <Select
                label="카테고리"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[{value: '1', label: '선택 1'}, {value: '2', label: '선택 2'}, {value: '3', label: '선택 3'},]}
            />

            {/* Modal */}
            <h2>Modal</h2>
            <Button onClick={() => setIsModalOpen(true)}>모달 열기</Button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>모달 테스트</p>
                <Button onClick={() => setIsModalOpen(false)}>닫기</Button>
            </Modal>

            {/* Toast */}
            <h2>Toast</h2>
            <Button onClick={() => setShowToast(true)}>토스트 띄우기</Button>
            {showToast && (<Toast
                message="저장되었습니다!"
                type="success"
                onClose={() => setShowToast(false)}
            />)}

            {/* Spinner */}
            <h2>Loading Spinner</h2>
            <LoadingSpinner/>

            {/* Pagination */}
            <h2>Pagination</h2>
            <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {/* Card */}
            <h2>Card</h2>
            <Card title="상품 정보">
                <p>이름: 토마토</p>
                <p>가격: 3,000원</p>
            </Card>

        </div>
    );

}