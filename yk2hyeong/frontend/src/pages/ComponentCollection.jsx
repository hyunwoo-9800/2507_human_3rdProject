import React, { useState } from 'react' // useState 임포트
import Button from '../components/common/Button' // 버튼
import Badge from '../components/common/Badge' // 뱃지
import Input from '../components/common/Input' // 입력창
import Textarea from '../components/common/Textarea' // textarea
import Radio from '../components/common/Radio' // 라디오
import CustomRadio from '../components/common/CustomRadio'
import Checkbox from '../components/common/Checkbox' // 체크박스
import TwoLevelSelect from '../components/common/TwoLevelSelect' // 2단 셀렉트
import CustomBreadcrumb from '../components/common/CustomBreadcrumb' // 브레드크럼(경로)
import CustomPagination from '../components/common/CustomPagination' // 페이지네이션
import CustomTabs from '../components/common/CustomTabs' // 탭
import CustomDatePicker from '../components/common/CustomDatePicker' // 날짜 선택기
import CustomInputNumber from '../components/common/CustomInputNumber' // 수량
import CustomUpload from '../components/common/CustomUpload' // 업로드 폼
import CustomFloatButton from '../components/common/CustomFloatButton' // 챗봇
import CustomCard from '../components/common/CustomCard' // 카드
import CustomCarousel from '../components/common/CustomCarousel' // 슬라이드 배너
import CustomSelect from '../components/common/CustomSelect' // 셀렉트
import CustomSidebarMenu from '../components/common/CustomSidebarMenu' // 사이드바
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons' // 사이드바용 아이콘
import CustomStatistic from '../components/common/CustomStatistic' // 통계
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons' // 통계용 아이콘
import CustomTag from '../components/common/CustomTag' // 태그
import CustomTable from '../components/common/CustomTable' // 테이블
import { Tag, Space, Alert, Spin } from 'antd' //태그, 여백, 알람, 로딩창용 근데 대충 모르겠으니까 일단 import
import CustomModal from '../components/common/CustomModal' // 모달
import CustomAlert from '../components/common/CustomAlert' // 알람
import RollingAlert from '../components/common/RollingAlert' // 롤링알람
import CustomLoading from '../components/common/CustomLoading' // 로딩바
import CustomDetailCard from '../components/common/CustomDetailCard' // 상품상세

function ComponentCollection() {
  // 상태 변수 정의
  const [activeTab, setActiveTab] = useState('buttons')
  const [inputValue, setInputValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [text, setText] = useState('')
  const [selectedValue, setSelectedValue] = useState('')
  const [checkedValues, setCheckedValues] = useState([])
  const categoryData = {
    식량작물: ['쌀', '찹쌀', '혼합곡'],
    채소류: ['배추', '양배추', '시금치'],
    특용작물: ['참깨', '들깨', '땅콩'],
    과일류: ['사과', '배', '복숭아'],
  }

  // target 이벤트 핸들러
  const handleInputChange = (e) => {
    setInputValue(e.target.value) // inputValue 상태를 업데이트
  }

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value) // emailValue 상태를 업데이트
  }

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value) // passwordValue 상태를 업데이트
  }

  const handleTextareaChange = (e) => {
    setText(e.target.value)
  }

  // TwoLevelSelect
  const handleSelectChange = (val) => {
    console.log('선택된 값:', val)
  }

  // 라디오
  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value)
  }

  const [orderType, setOrderType] = useState('immediate')

  const orderOptions = {
    immediate: true,
    reservation: true,
    reserveRate: 30,
  }

  const onOrderTypeChange = (value) => {
    console.log('선택된 타입:', value)
    // 필요한 추가 로직 여기에 작성
  }

  // 체크박스
  const handleCheckboxChange = (e) => {
    const value = e.target.value
    setCheckedValues((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  // 클릭 이벤트 핸들러
  const handleClick = (buttonType) => {
    alert(`${buttonType} `)
  }

  // 등록 버튼 클릭 시 확인 처리
  const handleRegister = () => {
    const confirmRegister = window.confirm('등록하시겠습니까?')
    if (confirmRegister) {
      alert('등록되었습니다.')
    } else {
      alert('등록이 취소되었습니다.')
    }
  }

  // 삭제 버튼 클릭 시 확인 처리
  const handleDelete = () => {
    const confirmDelete = window.confirm('삭제하시겠습니까?')
    if (confirmDelete) {
      alert('삭제되었습니다.')
    } else {
      alert('삭제가 취소되었습니다.')
    }
  }

  // 브레드크럼
  const separator = '>'
  const items = [
    { title: 'Home' },
    { title: 'Application Center', href: '' },
    { title: 'Application List', href: '' },
    { title: 'An Application' },
  ]

  // 페이지네이션
  const [page, setPage] = useState(6)
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber)
    console.log('페이지 변경:', pageNumber)
  }

  // 탭
  const [activeKey, setActiveKey] = useState('1')

  const handleTabChange = (key) => {
    console.log('선택된 탭 키:', key)
    setActiveKey(key)
  }

  const tabItems = Array.from({ length: 4 }).map((_, i) => {
    const id = String(i + 1)
    return {
      label: `Tab ${id}`,
      key: id,
      children: `Content of Tab Pane ${id}`,
    }
  })

  // 날짜선택
  const [date, setDate] = useState(null)

  const handleDateChange = (dateObj, dateString) => {
    console.log('선택된 날짜:', dateObj, dateString)
    setDate(dateObj)
  }

  // 숫자 증감

  //업로드
  const handleFileChange = ({ file, fileList }) => {
    if (file.status !== 'uploading') {
      console.log(file, fileList)
    }
  }

  const defaultFiles = [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'uploading',
      url: 'http://www.baidu.com/xxx.png',
      percent: 33,
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png',
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500',
      url: 'http://www.baidu.com/zzz.png',
    },
  ]

  // 배너
  const handleSlideClick = (index, item) => {
    alert(`슬라이드 ${index + 1} 클릭! 내용: ${item}`)
  }

  // 사이드바
  const menuItems = [
    {
      key: 'sub1',
      label: 'Navigation One',
      icon: <MailOutlined />,
      children: [
        { key: '1', label: 'Option 1' },
        { key: '2', label: 'Option 2' },
        { key: '3', label: 'Option 3' },
        { key: '4', label: 'Option 4' },
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      icon: <AppstoreOutlined />,
      children: [
        { key: '5', label: 'Option 5' },
        { key: '6', label: 'Option 6' },
      ],
    },
  ]

  //타이머 데드라인
  const deadline = Date.now() + 1000 * 60 * 60 * 24

  // 테이블
  // columns 정의 예시
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green'
            if (tag === 'loser') {
              color = 'volcano'
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            )
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ]

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ]

  const onSelectionChange = (selectedKeys, selectedRows) => {
    console.log('Selected keys:', selectedKeys)
    console.log('Selected rows:', selectedRows)
    // 삭제 등 이벤트 처리 여기에 작성 가능
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>컴포넌트 미리보기</h2>

      {/* 탭 메뉴 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setActiveTab('buttons')} style={{ padding: '10px' }}>
          버튼
        </button>
        <button onClick={() => setActiveTab('badges')} style={{ padding: '10px' }}>
          뱃지
        </button>
        <button onClick={() => setActiveTab('inputs')} style={{ padding: '10px' }}>
          입력
        </button>
        <button onClick={() => setActiveTab('checkbox')} style={{ padding: '10px' }}>
          라디오,체크박스
        </button>
        <button onClick={() => setActiveTab('breadcrumb')} style={{ padding: '10px' }}>
          기타-1
        </button>
        <button onClick={() => setActiveTab('cards')} style={{ padding: '10px' }}>
          카드
        </button>
        <button onClick={() => setActiveTab('carousel')} style={{ padding: '10px' }}>
          배너
        </button>
        <button onClick={() => setActiveTab('sidebar')} style={{ padding: '10px' }}>
          사이드바
        </button>
        <button onClick={() => setActiveTab('statistic')} style={{ padding: '10px' }}>
          통계
        </button>
        <button onClick={() => setActiveTab('tag')} style={{ padding: '10px' }}>
          태그
        </button>
        <button onClick={() => setActiveTab('table')} style={{ padding: '10px' }}>
          테이블
        </button>
        <button onClick={() => setActiveTab('modal')} style={{ padding: '10px' }}>
          모달
        </button>
        <button onClick={() => setActiveTab('alert')} style={{ padding: '10px' }}>
          알림
        </button>
      </div>

      {/* 버튼 */}
      {activeTab === 'buttons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 버튼들을 수직 방향으로 배치 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* 기본 버튼 (기본값 color=primary, size=md) */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={() => handleClick('여기에')}>기본</Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button onClick={() => handleClick('여기에')}>기본</Button>`}
              </pre>
            </div>

            {/* 색상별 버튼 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="primary" onClick={() => handleClick('alert')}>
                Primary
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="primary" onClick={() => handleClick('alert')}>Primary</Button>`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="secondary" onClick={() => handleClick('창에')}>
                Secondary
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="secondary" onClick={() => handleClick('창에')}>Secondary</Button>`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="accent" onClick={() => handleClick('띄우고')}>
                Accent
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="accent" onClick={() => handleClick('띄우고')}>Accent</Button>`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="info" onClick={() => handleClick('싶은')}>
                Info
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="info" onClick={() => handleClick('싶은')}>Info</Button>`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="success" onClick={() => handleClick('내용을')}>
                Success
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="success" onClick={() => handleClick('내용을')}>Success</Button>`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="warning" onClick={() => handleClick('입력하세요')}>
                Warning
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="warning" onClick={() => handleClick('입력하세요')}>Warning</Button>`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="error" onClick={() => handleClick('등록,삭제버튼은')}>
                Error
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="error" onClick={() => handleClick('등록,삭제버튼은')}>Error</Button>`}
              </pre>
            </div>

            {/* 크기별 버튼 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button size="sm" onClick={() => handleClick('있는그대로')}>
                Small
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button size="sm" onClick={() => handleClick('있는그대로')}>Small</Button>`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button size="md" onClick={() => handleClick('복사해서')}>
                Medium
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button size="md" onClick={() => handleClick('복사해서')}>Medium</Button>`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button size="lg" onClick={() => handleClick('쓰세요')}>
                Large
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button size="lg" onClick={() => handleClick('쓰세요')}>Large</Button>`}
              </pre>
            </div>

            {/* 등록 버튼 (color="primary") */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="primary" onClick={handleRegister}>
                등록
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="primary" onClick={handleRegister}>등록</Button>`}
              </pre>
            </div>

            {/* 삭제 버튼 (color="error") */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="error" onClick={handleDelete}>
                삭제
              </Button>
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {`<Button color="error" onClick={handleDelete}>삭제</Button>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 뱃지 */}
      {activeTab === 'badges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 기본 뱃지 (기본값 color=primary, size=md) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge>Primary Badge</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge>Primary Badge</Badge>`}
            </pre>
          </div>

          {/* 색상별 뱃지 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="primary">Primary Badge</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="primary">Primary Badge</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="secondary">Secondary Badge</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="secondary">Secondary Badge</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="accent">Accent Badge</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="accent">Accent Badge</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="info">Info Badge</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="info">Info Badge</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="success">Success Badge</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="success">Success Badge</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="warning">Warning Badge</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="warning">Warning Badge</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="error">Error Badge</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="error">Error Badge</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="accent">예약구매</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="accent">예약구매</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="info">예약구매</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="info">예약구매</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="success">예약구매</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="success">예약구매</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="accent">즉시구매</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="accent">즉시구매</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="info">즉시구매</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="info">즉시구매</Badge>`}
            </pre>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge color="success">즉시구매</Badge>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Badge color="success">즉시구매</Badge>`}
            </pre>
          </div>
        </div>
      )}

      {/* input */}
      {activeTab === 'inputs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 기본 Input */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input value={inputValue} onChange={handleInputChange} placeholder="텍스트 입력" />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Input value={inputValue} onChange={handleInputChange} placeholder="텍스트 입력" />`}
            </pre>
          </div>

          {/* 이메일 Input */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              type="email"
              value={emailValue}
              onChange={handleEmailChange}
              placeholder="이메일 입력"
            />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Input type="email" value={emailValue} onChange={handleEmailChange} placeholder="이메일 입력" />`}
            </pre>
          </div>

          {/* 비밀번호 Input */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              type="password"
              value={passwordValue}
              onChange={handlePasswordChange}
              placeholder="비밀번호 입력"
            />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Input type="password" value={passwordValue} onChange={handlePasswordChange} placeholder="비밀번호 입력" />`}
            </pre>
          </div>

          {/* textarea */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Textarea
              value={text}
              onChange={handleTextareaChange}
              placeholder="여기에 내용을 입력하세요"
              size="md"
            />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Textarea value={text} onChange={handleTextareaChange} placeholder="여기에 내용을 입력하세요" size="md"/>`}
            </pre>
          </div>

          {/* Select */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomSelect
              names={['Apple', 'Banana', 'Cherry']}
              allowClear
              placeholder="과일을 선택하세요"
            />

            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomSelect names={['Apple', 'Banana', 'Cherry']} 
allowClear placeholder="과일을 선택하세요"/>`}
            </pre>
          </div>

          {/* TwoLevelSelect */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TwoLevelSelect categoryData={categoryData} size="md" onChange={handleSelectChange} />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<TwoLevelSelect categoryData={categoryData} size="md" onChange={handleSelectChange} />`}
            </pre>
          </div>
        </div>
      )}

      {/* 라디오, 체크박스 */}
      {activeTab === 'checkbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 기본(primary) 라디오 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Radio
              value="option1"
              label="1번"
              checked={selectedValue === 'option1'}
              onChange={handleRadioChange}
              name="group1"
              color="primary" // 색상은 color prop으로 지정
            />

            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Radio value="option1" label="1번" checked={selectedValue === 'option1'} onChange={handleRadioChange} name="group1" color="primary"/>`}
            </pre>
          </div>

          {/* 검정색(black) 라디오 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Radio
              value="option2"
              label="2번"
              checked={selectedValue === 'option2'}
              onChange={handleRadioChange}
              name="group1"
              color="black" // 검정색(black) 색상
            />

            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Radio value="option2" label="2번" checked={selectedValue === 'option2'} onChange={handleRadioChange} name="group1" color="black"/>`}
            </pre>
          </div>

          {/* ant design 라디오 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomRadio
              value={orderType}
              onChange={(val) => {
                setOrderType(val)
                onOrderTypeChange(val)
              }}
              options={[
                ...(orderOptions.immediate ? [{ label: '즉시 구매', value: 'immediate' }] : []),
                ...(orderOptions.reservation ? [{ label: '예약 구매', value: 'reservation' }] : []),
              ]}
              name="orderType"
            />

            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {` < CustomRadio
value={orderType}
onChange={(val) => {
    setOrderType(val);
    onOrderTypeChange(val);
}}
options={[
    ...(orderOptions.immediate ? [{ label: '즉시 구매', value: 'immediate' }] : []),
    ...(orderOptions.reservation ? [{ label: '예약 구매', value: 'reservation' }] : []),
]}
name="orderType" />`}
            </pre>
          </div>

          {/* 기본(primary) 체크박스 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              value="check1"
              label="이용약관에 동의합니다"
              checked={checkedValues.includes('check1')}
              onChange={handleCheckboxChange}
              color="primary" // 색상은 color prop으로 지정
            />

            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Checkbox value="check1" label="이용약관에 동의합니다" checked={checkedValues.includes('check1')} onChange={handleCheckboxChange} color="primary"/>`}
            </pre>
          </div>

          {/* 검정색(black) 체크박스 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              value="check2"
              label="라벨입니다"
              checked={checkedValues.includes('check2')}
              onChange={handleCheckboxChange}
              color="black" // 검정색(black) 색상
            />

            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              {`<Checkbox value="check2" label="라벨입니다" checked={checkedValues.includes('check2')} onChange={handleCheckboxChange} color="black"/> `}
            </pre>
          </div>
        </div>
      )}

      {/* 브레드크럼 */}
      {activeTab === 'breadcrumb' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 브레드크럼 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomBreadcrumb separator={separator} items={items} />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomBreadcrumb separator={separator} items={items} />`}
            </pre>
          </div>

          {/* 페이지네이션 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomPagination
              defaultCurrent={page}
              total={100}
              pageSize={10}
              onChange={handlePageChange}
            />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomPagination defaultCurrent={page} total={100} pageSize={10} onChange={handlePageChange}/>`}
            </pre>
          </div>

          {/* 탭 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomTabs items={tabItems} type="card" onChange={handleTabChange} />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomTabs items={tabItems} type="card" onChange={handleTabChange} />`}
            </pre>
          </div>

          {/* 날짜선택 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomDatePicker
              onChange={handleDateChange}
              needConfirm={true} // 필요하면 true로 설정
              format="YYYY-MM-DD"
            />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomDatePicker onChange={handleDateChange} needConfirm={true} format="YYYY-MM-DD"/>`}
            </pre>
          </div>

          {/* 숫자증감 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomInputNumber
              defaultValue={100}
              min={0}
              max={200}
              step={1}
              onChange={(val) => console.log('값 변경:', val)}
            />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomInputNumber defaultValue={100} min={0} max={200} step={1} 
onChange={(val) => console.log('값 변경:', val)} />`}
            </pre>
          </div>

          {/* 업로드 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomUpload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              onChange={handleFileChange}
              defaultFileList={defaultFiles}
              buttonText="Upload Files"
            />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomUpload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" 
onChange={handleFileChange} 
defaultFileList={defaultFiles} 
buttonText="Upload Files"/>`}
            </pre>
          </div>

          {/* 챗봇 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomFloatButton
              icon={<span style={{ fontSize: '18px' }}>💬</span>}
              tooltip="문의하기"
              onClick={() => alert('챗봇 버튼 클릭')}
            />
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomFloatButton icon={<span style={{ fontSize: '18px' }}>💬</span>} tooltip="문의하기" onClick={() => alert('챗봇 버튼 클릭')}/>`}
            </pre>
          </div>
        </div>
      )}

      {/* 카드 */}
      {activeTab === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 아이템카드 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3> 즐겨찾기 + 즉시 + 예약</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomCard
                id="p-001"
                image="/static/images/tomato.png"
                company="천안청과(주)"
                productName="스테비아 방울토마토"
                price={10500}
                minQuantity={100}
                immediatePurchase={true}
                reservationPurchase={true}
                favorite={true}
              />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`< CustomCard
id="p-001"
image="/static/images/tomato.png"
company="천안청과(주)"
productName="스테비아 방울토마토"
price={10500}
minQuantity={100}
immediatePurchase={true}
reservationPurchase={true}
favorite={true} />
`}
              </pre>
            </div>
          </div>

          {/* 즐겨찾기x + 즉시 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>즐겨찾기x + 즉시 </h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomCard
                id="p-001"
                image="/static/images/tomato.png"
                company="천안청과(주)"
                productName="스테비아 방울토마토"
                price={10500}
                minQuantity={100}
                immediatePurchase={true}
                reservationPurchase={false}
                favorite={false}
              />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`< CustomCard
id="p-001"
image="/static/images/tomato.png"
company="천안청과(주)"
productName="스테비아 방울토마토"
price={10500}
minQuantity={100}
immediatePurchase={true}
reservationPurchase={false}
favorite={false} />
`}
              </pre>
            </div>
          </div>

          {/* 즐겨찾기x + 예약 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>즐겨찾기x + 예약</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomCard
                id="p-001"
                image="/static/images/tomato.png"
                company="천안청과(주)"
                productName="스테비아 방울토마토"
                price={10500}
                minQuantity={100}
                immediatePurchase={false}
                reservationPurchase={true}
                favorite={false}
              />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {` <CustomCard
id="p-001"
image="/static/images/tomato.png"
company="천안청과(주)"
productName="스테비아 방울토마토"
price={10500}
minQuantity={100}
immediatePurchase={false}
reservationPurchase={true}
favorite={false} />
`}
              </pre>
            </div>
          </div>

          {/* 상품상세 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>상품상세 + 즉시구매 , 예약구매</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <CustomDetailCard
                productName="스테비아 방울토마토"
                productCode="P250703-000121"
                quantity={239994}
                shippingRegion="전체"
                availableDate="판매자 문의"
                price={10500}
                releaseDate="2026년 7월 4일"
                minOrder={100}
                defaultQuantity={100}
                defaultOrderType="immediate"
                images={[
                  '/static/images/tomato.png',
                  '/static/images/potato.png',
                  '/static/images/carrot.png',
                ]}
                orderOptions={{
                  immediate: true,
                  reservation: true,
                  reserveRate: 30,
                }}
                onQuantityChange={(q) => console.log('변경된 수량:', q)}
                onOrderTypeChange={(t) => console.log('선택된 타입:', t)}
                onOrder={(info) => console.log('주문 정보:', info)}
              />

              <pre
                style={{
                  marginTop: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {` <CustomDetailCard
productName="스테비아 방울토마토"
productCode="P250703-000121"
quantity={239994}
shippingRegion="전체"
availableDate="판매자 문의"
price={10500}
releaseDate="2026년 7월 4일"
minOrder={100}
defaultQuantity={100}
defaultOrderType="immediate"
images={[
    '/static/images/tomato.png',
    '/static/images/potato.png',
    '/static/images/carrot.png'
]}
orderOptions={{
    immediate: true,
    reservation: true,
    reserveRate: 30,
}}
onQuantityChange={(q) => console.log("변경된 수량:", q)}
onOrderTypeChange={(t) => console.log("선택된 타입:", t)}
onOrder={(info) => console.log("주문 정보:", info)} />
`}
              </pre>
            </div>
          </div>

          {/* 상품상세 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>상품상세 + 예약구매</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomDetailCard
                productName="스테비아 방울토마토"
                productCode="P250703-000121"
                quantity={239994}
                shippingRegion="전체"
                availableDate="판매자 문의"
                price={10500}
                releaseDate="2026년 7월 4일"
                minOrder={100}
                defaultQuantity={100}
                defaultOrderType="reservation"
                images={[
                  '/static/images/tomato.png',
                  '/static/images/potato.png',
                  '/static/images/carrot.png',
                ]}
                orderOptions={{
                  immediate: false,
                  reservation: true,
                  reserveRate: 30,
                }}
                onQuantityChange={(q) => console.log('변경된 수량:', q)}
                onOrderTypeChange={(t) => console.log('선택된 타입:', t)}
                onOrder={(info) => console.log('주문 정보:', info)}
              />

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {` <CustomDetailCard
productName="스테비아 방울토마토"
productCode="P250703-000121"
quantity={239994}
shippingRegion="전체"
availableDate="판매자 문의"
price={10500}
releaseDate="2026년 7월 4일"
minOrder={100}
defaultQuantity={100}
defaultOrderType="reservation"
images={[
    '/static/images/tomato.png',
    '/static/images/potato.png',
    '/static/images/carrot.png''
]}
orderOptions={{
    immediate: false,
    reservation: true,
    reserveRate: 30,
}}
onQuantityChange={(q) => console.log("변경된 수량:", q)}
onOrderTypeChange={(t) => console.log("선택된 타입:", t)}
onOrder={(info) => console.log("주문 정보:", info)} />
`}
              </pre>
            </div>
          </div>

          {/* 상품상세 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>상품상세 + 즉시구매</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomDetailCard
                productName="스테비아 방울토마토"
                productCode="P250703-000121"
                quantity={239994}
                shippingRegion="전체"
                availableDate="판매자 문의"
                price={10500}
                releaseDate="2026년 7월 4일"
                minOrder={100}
                defaultQuantity={100}
                defaultOrderType="immediate"
                images={[
                  '/static/images/tomato.png',
                  '/static/images/potato.png',
                  '/static/images/carrot.png',
                ]}
                orderOptions={{
                  immediate: true,
                  reservation: false,
                }}
                onQuantityChange={(q) => console.log('변경된 수량:', q)}
                onOrderTypeChange={(t) => console.log('선택된 타입:', t)}
                onOrder={(info) => console.log('주문 정보:', info)}
              />

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {` <CustomDetailCard
productName="스테비아 방울토마토"
productCode="P250703-000121"
quantity={239994}
shippingRegion="전체"
availableDate="판매자 문의"
price={10500}
releaseDate="2026년 7월 4일"
minOrder={100}
defaultQuantity={100}
defaultOrderType="immediate"
images={[
    '/static/images/tomato.png',
    '/static/images/potato.png',
    '/static/images/carrot.png'
]}
orderOptions={{
    immediate: true,
    reservation: false,
}}
onQuantityChange={(q) => console.log("변경된 수량:", q)}
onOrderTypeChange={(t) => console.log("선택된 타입:", t)}
onOrder={(info) => console.log("주문 정보:", info)} />
`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 배너 */}
      {activeTab === 'carousel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 배너 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '600px', maxWidth: '100%', margin: '0 auto' }}>
              <CustomCarousel
                items={['첫 번째', '두 번째', '세 번째']}
                autoplay={true}
                arrows={true}
                pauseOnHover={true}
                onClick={(index, item) => alert(`슬라이드 ${index + 1} 클릭! 내용: ${item}`)}
              />
            </div>
            <pre
              style={{
                marginLeft: 20,
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap', // 긴 줄이 줄바꿈되도록 설정
                wordWrap: 'break-word', // 단어 단위로 줄바꿈
                overflowX: 'auto', // 가로 스크롤 추가
              }}
            >
              {`<CustomCarousel items={['첫 번째', '두 번째', '세 번째']} autoplay={true} arrows={true} pauseOnHover={true} onClick={(index, item) => alert(\`슬라이드 \${index + 1} 클릭! 내용: \${item}\`)}/>`}
            </pre>
          </div>
        </div>
      )}

      {/* 사이드바 */}
      {activeTab === 'sidebar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 사이드바 닫기 옵션 없음 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>사이드바 닫기 옵션 없음, 라이트테마</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomSidebarMenu
                items={menuItems}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1', 'sub2']}
                onToggle={(collapsed) => console.log('Sidebar collapsed:', collapsed)}
              />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`const menuItems = [
        {
            key: 'sub1',
            label: 'Navigation One',
            icon: <MailOutlined />,
            children: [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' },
                { key: '3', label: 'Option 3' },
                { key: '4', label: 'Option 4' }
            ]
        },
        {
            key: 'sub2',
            label: 'Navigation Two',
            icon: <AppstoreOutlined />,
            children: [
                { key: '5', label: 'Option 5' },
                { key: '6', label: 'Option 6' }
            ]
        }
    ];
위에 이거 선언한 다음========================================================

<CustomSidebarMenu
items={menuItems}
defaultSelectedKeys={['1']}
defaultOpenKeys={['sub1','sub2']}
onToggle={(collapsed) => console.log('Sidebar collapsed:', collapsed)}/>

--------------------------------------------------------------------------
defaultSelectedKeys={['1']} => 기본으로 선택될 하위 탭
defaultOpenKeys={['sub1','sub2']} => 기본으로 열려 있을 상위 탭
`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 통계 */}
      {activeTab === 'statistic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 기본형 숫자 + 애니메이션 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>기본형 숫자 + 애니메이션</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomStatistic title="Active Users" value={112893} animated />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomStatistic
title="Active Users"
value={112893}
animated/>`}
              </pre>
            </div>
          </div>

          {/* 카드형 + 숫자 + prefix, suffix */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>카드형 + 숫자 + prefix, suffix</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomStatistic
                variant="card"
                title="Active"
                value={11.28}
                precision={2}
                prefix={<ArrowUpOutlined />}
                suffix="%"
                style={{ color: '#3f8600' }}
                cardProps={{ bordered: false }}
              />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomStatistic
variant="card"
title="Active"
value={11.28}
precision={2}
prefix={<ArrowUpOutlined />}
suffix="%"
style={{ color: '#3f8600' }}
cardProps={{ bordered: false }}/>`}
              </pre>
            </div>
          </div>

          {/* 카드형 + 카운트다운 타이머 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>카드형 + 카운트다운 타이머</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomStatistic
                variant="card"
                isTimer
                timerType="countdown"
                value={deadline}
                title="Countdown Timer"
                timerFormat="HH:mm:ss"
                onFinish={() => console.log('finished!')}
                cardProps={{ bordered: false }}
              />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomStatistic
variant="card"
isTimer
timerType="countdown"
value={deadline}
title="Countdown Timer"
timerFormat="HH:mm:ss"
onFinish={() => console.log('finished!')}
cardProps={{ bordered: false }}/>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 태그 */}
      {activeTab === 'tag' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 🎨 Ant Design에서 제공하는 기본 색상 태그 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>🎨 Ant Design에서 제공하는 기본 색상 태그</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomTag color="magenta" label="magenta" />
              <CustomTag color="red" label="red" />
              <CustomTag color="volcano" label="volcano" />
              <CustomTag color="orange" label="orange" />
              <CustomTag color="gold" label="gold" />
              <CustomTag color="lime" label="lime" />
              <CustomTag color="green" label="green" />
              <CustomTag color="cyan" label="cyan" />
              <CustomTag color="blue" label="blue" size="small" />
              <CustomTag color="geekblue" label="geekblue" size="default" />
              <CustomTag color="purple" label="purple" size="large" />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomTag color="magenta" label="magenta" />
<CustomTag color="red" label="red" />
<CustomTag color="volcano" label="volcano" />
<CustomTag color="orange" label="orange" />
<CustomTag color="gold" label="gold" />
<CustomTag color="lime" label="lime" />
<CustomTag color="green" label="green" />
<CustomTag color="cyan" label="cyan" />
<CustomTag color="blue" label="blue" size="small" />
<CustomTag color="geekblue" label="geekblue" size="default "/>
<CustomTag color="purple" label="purple" size="large" />`}
              </pre>
            </div>
          </div>

          {/* 🎨 사용자 정의 Tailwind 기반 커스텀 색상 태그 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>🎨 사용자 정의 Tailwind 기반 커스텀 색상 태그</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomTag color="customPrimary" label="customPrimary" />
              <CustomTag color="customSecondary" label="customSecondary" />
              <CustomTag color="customAccent" label="customAccent" />
              <CustomTag color="customInfo" label="customInfo" />
              <CustomTag color="customSuccess" label="customSuccess" size="small" />
              <CustomTag color="customWarning" label="customWarning" size="default" />
              <CustomTag color="customError" label="customError" size="large" />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomTag color="customPrimary" label="customPrimary" />
<CustomTag color="customSecondary" label="customSecondary" />
<CustomTag color="customAccent" label="customAccent" />
<CustomTag color="customInfo" label="customInfo" />
<CustomTag color="customSuccess" label="customSuccess" size="small" />
<CustomTag color="customWarning" label="customWarning" size="default" />
<CustomTag color="customError" label="customError" size="large" />`}
              </pre>
            </div>
          </div>

          {/* 상태 태그 (아이콘 없이) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>상태 태그 (아이콘 없이)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomTag color="success" label="success" />
              <CustomTag color="processing" label="processing" />
              <CustomTag color="error" label="error" />
              <CustomTag color="warning" label="warning" size="small" />
              <CustomTag color="default" label="default" size="large" />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomTag color="success" label="success" />
<CustomTag color="processing" label="processing" />
<CustomTag color="error" label="error" />
<CustomTag color="warning" label="warning" size="small" />
<CustomTag color="default" label="default" size="large" />`}
              </pre>
            </div>
          </div>

          {/* ✅ 상태 태그 (아이콘 포함) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>✅ 상태 태그 (아이콘 포함)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomTag color="success" label="success" iconName="success" />
              <CustomTag color="processing" label="processing" iconName="processing" />
              <CustomTag color="error" label="error" iconName="error" />
              <CustomTag color="warning" label="warning" iconName="warning" />
              <CustomTag color="default" label="waiting" iconName="waiting" size="small" />
              <CustomTag color="default" label="stop" iconName="stop" size="large" />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomTag color="success" label="success" iconName="success" />
<CustomTag color="processing" label="processing" iconName="processing" />
<CustomTag color="error" label="error" iconName="error" />
<CustomTag color="warning" label="warning" iconName="warning" />
<CustomTag color="default" label="waiting" iconName="waiting" size="small" />
<CustomTag color="default" label="stop" iconName="stop" size="large" />`}
              </pre>
            </div>
          </div>

          {/* 📱 소셜 미디어 태그 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>📱 소셜 미디어 태그</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomTag color="#55acee" label="Twitter" iconName="twitter" />
              <CustomTag color="#cd201f" label="Youtube" iconName="youtube" />
              <CustomTag color="#3b5999" label="Facebook" iconName="facebook" size="small" />
              <CustomTag color="#55acee" label="LinkedIn" iconName="linkedin" size="large" />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomTag color="#55acee" label="Twitter" iconName="twitter" />
<CustomTag color="#cd201f" label="Youtube" iconName="youtube" />
<CustomTag color="#3b5999" label="Facebook" iconName="facebook" size="small" />
<CustomTag color="#55acee" label="LinkedIn" iconName="linkedin" size="large" />`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 테이블 */}
      {activeTab === 'table' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 체크박스 테이블 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>체크박스 테이블</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomTable
                columns={columns}
                data={data}
                selectionType="checkbox"
                onSelectionChange={onSelectionChange}
              />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`상단에 import { Tag, Space } from 'antd';
<CustomTable
columns={columns}
data={data}
selectionType="checkbox"
onSelectionChange={onSelectionChange}/>`}
              </pre>
            </div>
          </div>

          {/* 라디오 테이블 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>라디오 테이블</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomTable
                columns={columns}
                data={data}
                selectionType="radio"
                onSelectionChange={onSelectionChange}
              />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`상단에 import { Tag, Space } from 'antd';
<CustomTable
columns={columns}
data={data}
selectionType="radio"
onSelectionChange={onSelectionChange}/>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 모달 */}
      {activeTab === 'modal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 경고모달 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>경고모달 + 취소/확인</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomModal
                type="warning"
                title="경고모달"
                content="취소랑 확인"
                onCancel={() => console.log('취소함')}
                onOk={() => console.log('확인함')}
                cancelMessage="취소되었습니다."
                successMessage="확인되었습니다."
                buttonLabel="경고"
              />

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomModal
type="warning"
title="경고모달"
content="취소랑 확인"
onCancel={() => console.log('취소함')}
onOk={() => console.log('확인함')}
cancelMessage="취소되었습니다."
successMessage="확인되었습니다."
buttonLabel="경고"/>`}
              </pre>
            </div>
          </div>

          {/* 경고 모달 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>경고 모달 + 확인</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomModal
                type="warning"
                title="주의하세요!"
                content="이 작업은 위험할 수 있습니다."
                onOk={() => console.log('경고 확인')}
                buttonLabel="Warning"
                buttonColor="warning"
                showCancel={false}
              />

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomModal
type="warning"
title="주의하세요!"
content="이 작업은 위험할 수 있습니다."
onOk={() => console.log('경고 확인')}
buttonLabel="Warning"
buttonColor="warning"
showCancel={false}/>`}
              </pre>
            </div>
          </div>

          {/* 정보 모달 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>정보 모달</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomModal
                type="info"
                title="정보 알림"
                content="이것은 정보성 메시지입니다."
                onOk={() => console.log('정보 확인')}
                buttonLabel="정보"
                showCancel={false}
              />

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomModal
type="info"
title="정보 알림"
content="이것은 정보성 메시지입니다."
onOk={() => console.log('정보 확인')}
buttonLabel="정보"
showCancel={false}/>`}
              </pre>
            </div>
          </div>

          {/* 에러 모달 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>에러 모달</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomModal
                type="error"
                title="오류 발생"
                content="문제가 발생했습니다."
                onOk={() => console.log('오류 확인')}
                buttonLabel="Error"
                showCancel={false} // 취소 버튼 노출 여부 (기본 true)
              />

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomModal
type="error"
title="오류 발생"
content="문제가 발생했습니다."
onOk={() => console.log('오류 확인')}
buttonLabel="Error"
showCancel={false}/>`}
              </pre>
            </div>
          </div>

          {/* 삭제 모달 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>삭제 모달</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomModal
                type="error"
                title="삭제"
                content="정말 삭제하시겠습니까?"
                onCancel={() => console.log('삭제 취소')}
                onOk={() => console.log('삭제 처리 로직 실행')}
                successMessage="삭제되었습니다."
                cancelMessage="삭제가 취소되었습니다."
                buttonLabel="삭제"
              />

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomModal
type="error"
title="삭제"
content="정말 삭제하시겠습니까?"
onCancel={() => console.log('삭제 취소')}
onOk={() => console.log('삭제 처리 로직 실행')}
successMessage="삭제되었습니다."
cancelMessage="삭제가 취소되었습니다."
buttonLabel="삭제"/>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 알람 */}
      {activeTab === 'alert' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 완료알람 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>알람</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <CustomAlert type="success" message="완료되었습니다!" />
              <CustomAlert
                type="info"
                message="안내사항입니다."
                description="추가 정보를 확인하세요."
              />
              <CustomAlert
                type="warning"
                message="주의!"
                description="데이터를 확인하세요."
                closable
              />
              <CustomAlert type="error" message="오류 발생" />
              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomAlert type="success" message="완료되었습니다!" />
<CustomAlert type="info" message="안내사항입니다." description="추가 정보를 확인하세요." />
<CustomAlert type="warning" message="주의!" description="데이터를 확인하세요." closable />
<CustomAlert type="error" message="오류 발생" />`}
              </pre>
            </div>
          </div>

          {/* 롤링알람 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>롤링알람</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <RollingAlert message="긴급공지: 오늘은 시스템 점검으로 일부 기능이 제한됩니다." />

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<RollingAlert message="긴급공지: 오늘은 시스템 점검으로 일부 기능이 제한됩니다." />`}
              </pre>
            </div>
          </div>

          {/* 로딩 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>로딩</h3>

            {/* 첫 번째 줄: 기본 로딩들 + 코드 */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <CustomLoading size="small" />
                <CustomLoading />
                <CustomLoading size="large" />
                <CustomLoading tipMessage="Alert message title" />
              </div>

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomLoading size="small" />
<CustomLoading />
<CustomLoading size="large" />
<CustomLoading tipMessage="Alert message title" />`}
              </pre>
            </div>

            {/* 두 번째 줄: Spin + 코드 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 20 }}>
              <Spin tip="로딩 중...">
                <Alert
                  message="Alert message title"
                  description="Further details about the context of this alert."
                  type="info"
                />
              </Spin>

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<Spin tip="로딩 중...">
    <Alert
        message="Alert message title"
        description="Further details about the context of this alert."
        type="info"
    />
</Spin>`}
              </pre>
            </div>

            {/* 세 번째 줄: CustomLoading + Alert + 코드 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 20 }}>
              <CustomLoading>
                <Alert
                  message="Alert message title"
                  description="Further details about the context of this alert."
                  type="info"
                />
              </CustomLoading>

              <pre
                style={{
                  marginLeft: 20,
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowX: 'auto',
                }}
              >
                {`<CustomLoading>
  <Alert
    message="Alert message title"
    description="Further details about the context of this alert."
    type="info"
  />
</CustomLoading>`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ComponentCollection
