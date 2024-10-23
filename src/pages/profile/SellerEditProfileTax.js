import React, { useEffect, useReducer } from 'react'
import SellerEditProfileHeader from '../../components/setup/SellerEditProfileHeader'
import { RiImageAddFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Button, Col, Input, message, Row, Select } from 'antd'
import { updateShopProfile } from '../../services/shopService'
import { setShop } from '../../redux/shopSlice'

const initialState = {
  disable_fields: true,
  businessStyles: [],
  selectedBusinessStyle: null,
  email: '',
  tax_code: '',
  isSubmitted: false,
  enableConfirm: true,
  errors: {
    email: '',
    tax_code: ''
  },
  touched: {
    email: false,
    tax_code: false
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DISABLE_FIELDS':
      return { ...state, disable_fields: action.payload }
    case 'SET_BUSINESS_STYLES':
      return { ...state, businessStyles: action.payload };
    case 'SET_SELECTED_BUSINESS_STYLE':
      return { ...state, selectedBusinessStyle: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_TAX_CODE':
      return { ...state, tax_code: action.payload };
    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.payload }
    case 'SET_ENABLE_CONFIRM':
      return { ...state, enableConfirm: action.payload }
    case 'SET_SUBMIT_LOADING':
      return { ...state, submit_loading: action.payload }
    case 'SET_PAYLOAD_SAVE':
      return { ...state, payload_save: action.payload }
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload]: true
        }
      };
    default:
      return state;
  }
};

const SellerEditProfileTax = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const shop = useSelector(state => state.shop);
  const dispatchShop = useDispatch();
  const handleEditButton = () => {
    dispatch({ type: 'SET_DISABLE_FIELDS', payload: state.disable_fields ? false : true });
  }

  const handleCancelEdit = () => {
    window.location.reload();
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
    dispatch({ type: 'SET_TOUCHED', payload: name });
  };

  const handleSelectChange = (value) => {
    dispatch({ type: 'SET_SELECTED_BUSINESS_STYLE', payload: value });
    // console.log("Selected business style", value);  
  };

  const validate = () => {
    let valid = true;
    let newErrors = { email: '', tax_code: '' };

    if (!state.email) {
      newErrors.email = 'Vui lòng nhập email';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = 'Email không hợp lệ';
      valid = false;
    }

    // validate tax code
    if (state.tax_code == '') {
      newErrors.tax_code = 'Hãy nhập mã số thuế';
      valid = false;
    }

    dispatch({ type: 'SET_ERRORS', payload: newErrors });
    return valid;
  };
  useEffect(() => {
    console.log("Validate error", state.errors);
    const check = validate();
    if (check && state.selectedBusinessStyle) {
      const data = {
        shop_id: shop.shop_id,
        business_email: state.email,
        tax_code: state.tax_code,
        business_style_id: state.selectedBusinessStyle,
      }
      console.log("Update payload", data);
      dispatch({ type: 'SET_PAYLOAD_SAVE', payload: data });
      dispatch({ type: 'SET_ENABLE_CONFIRM', payload: false });
    }
    else {
      console.log("Update payload error");
      dispatch({ type: 'SET_PAYLOAD_SAVE', payload: null });
      dispatch({ type: 'SET_ENABLE_CONFIRM', payload: true });
    }
  }, [state.email, state.tax_code, state.selectedBusinessStyle]);



  useEffect(() => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/all-business-styles`;
    const getBusinessStyles = async () => {
      try {
        const res = await axios({
          method: "GET",
          url: URL,
        });
        if (res.status === 200) {
          dispatch({ type: 'SET_BUSINESS_STYLES', payload: res.data.data });
        }
        else
          console.log("Error");
      } catch (error) {
        console.log("Error fetch business styles:", error);
      }
    }
    getBusinessStyles();
  }, []);


  useEffect(() => {
    if (shop) {
      dispatch({ type: 'SET_SELECTED_BUSINESS_STYLE', payload: shop.business_style_id });
      dispatch({ type: 'SET_EMAIL', payload: shop.business_email });
      dispatch({ type: 'SET_TAX_CODE', payload: shop.tax_code });
    }
  }, [shop])
  const handleSave = async () => {
    let payload;
    if (state.payload_save) {
      dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
      payload = state.payload_save;
      try {
        const res = await updateShopProfile(payload);
        console.log("Update shop profile successfully", res.data);
        message.success('Cập nhật thông tin thành công');
        dispatchShop(setShop(res.data));
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
        handleEditButton();
      } catch (error) {
        console.log("Error update shop profile", error);
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
        message.error('Cập nhật thông tin thất bại');
        handleEditButton();
      }
    }
  }

  return (
    <div>
      <SellerEditProfileHeader status={'/seller/seller-edit-profile/tax-info'} />
      <div className='mt-5 mb-10 bg-white py-5 my-10 rounded'>
        <div className='flex justify-between px-8 mb-5'>
          <h3 className='text-lg'>Thông tin thuế</h3>
          <Button
            onClick={handleEditButton}
            loading={state.submit_loading}
          >Chỉnh sửa</Button>
        </div>
        <div>
          <Row gutter={12} className='flex items-center'>
            <Col span={4} className='flex justify-end font-semibold text-sm'>
              Loại hình kinh doanh
            </Col>
            <Col span={20}>
              <Select
                onChange={handleSelectChange}
                placeholder='Chọn loại hình kinh doanh'
                disabled={state.disable_fields}
                value={state.selectedBusinessStyle}
                className='w-72'>
                {state.businessStyles.map((item, index) => (
                  <Select.Option
                    key={index}
                    value={item.business_style_id}
                    onClick={() => handleSelectChange(item.business_style_id)}
                  >
                    {item.business_style_name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={12} className='mt-5 flex items-center'>
            <Col span={4} className='flex justify-end font-semibold text-sm'>
              Email
            </Col>
            <Col span={20} className='flex items-center'>
              <Input
                placeholder='Nhập vào'
                className={`w-72 ${state.disable_fields ? 'bg-gray-100 text-gray-500' : ''}`}
                name='email'
                value={state.email}
                disabled={state.disable_fields}
                onChange={handleInputChange}
              />
              {state.touched.email && state.errors.email && <div className='text-red-500 ml-5'>{state.errors.email}</div>}
            </Col>
          </Row>
          <Row gutter={12} className='mt-5 flex items-center'>
            <Col span={4} className='flex justify-end font-semibold text-sm'>
              Mã số thuế
            </Col>
            <Col span={20} className='flex items-center'>
              <Input
                placeholder='Nhập vào'
                className={`w-72 ${state.disable_fields ? 'bg-gray-100 text-gray-500' : ''}`}
                name='tax_code'
                disabled={state.disable_fields}
                value={state.tax_code}
                onChange={handleInputChange}
              />
              {state.touched.tax_code && state.errors.tax_code && <div className='text-red-500 ml-5'>{state.errors.tax_code}</div>}
            </Col>
          </Row>
          {!state.disable_fields && (
            <div className='flex gap-3 justify-end mr-10 mt-10'>
              <Button
                disabled={state.enableConfirm}
                onClick={async () => await handleSave()}
                loading={state.submit_loading}
              >
                Lưu
              </Button>
              <Button
                onClick={handleCancelEdit}
                loading={state.submit_loading}
              >
                Hủy
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerEditProfileTax