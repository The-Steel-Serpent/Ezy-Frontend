import { Button, Col, Input, Row, Select } from 'antd'
import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import { useLocation } from 'react-router-dom'

const initialState = {
  businessStyles: [],
  selectedBusinessStyle: null,
  businessEmail: '',
  businessTaxCode: '',
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
    case 'SET_BUSINESS_STYLES':
      return {
        ...state,
        businessStyles: action.payload
      };
    case 'SET_SELECTED_BUSINESS_STYLE':
      return {
        ...state,
        selectedBusinessStyle: action.payload
      };
    case 'SET_BUSINESS_EMAIL':
      return {
        ...state,
        businessEmail: action.payload
      };
    case 'SET_BUSINESS_TAX_CODE':
      return {
        ...state,
        businessTaxCode: action.payload
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload
      };
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


const TaxInformation = ({ onData }) => {
  const location = useLocation();
  const isSellerSetupPath = location.pathname === '/seller/seller-setup';
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: `SET_BUSINESS_${name.toUpperCase()}`, payload: value });
    dispatch({ type: 'SET_TOUCHED', payload: name });
  };
  const validate = () => {
    let valid = true;
    let newErrors = { email: '', tax_code: '' };

    if (!state.businessEmail) {
      newErrors.email = 'Vui lòng nhập email';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.businessEmail)) {
      newErrors.email = 'Email không hợp lệ';
      valid = false;
    }

    // validate tax code
    if (state.businessTaxCode == '') {
      newErrors.tax_code = 'Hãy nhập mã số thuế';
      valid = false;
    }

    dispatch({ type: 'SET_ERRORS', payload: newErrors });
    return valid;
  };

  const handleSelectChange = (value) => {
    dispatch({ type: 'SET_SELECTED_BUSINESS_STYLE', payload: value });
    // console.log("Selected business style", value);  
  }

  // validate input and pass data to parent component
  useEffect(() => {
    console.log("Validate error", state.errors);
    const check = validate();
    if (check && state.selectedBusinessStyle) {
      const data = {
        business_email: state.businessEmail,
        tax_code: state.businessTaxCode,
        business_style_id: state.selectedBusinessStyle,
        noErrorTaxInfo: true
      }
      onData(data);
    }
    else {
      onData({ noErrorTaxInfo: false });
    }
  }, [state.businessEmail, state.businessTaxCode, state.selectedBusinessStyle]);



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

  return (
    <div>
      <h3 className='text-lg font-semibold'>Thông tin thuế</h3>
      <div className='mt-5 ml-10 mb-10'>
        <Row gutter={12} className='flex items-center'>
          <Col span={4} className='flex justify-end font-semibold text-sm'>
            Loại hình kinh doanh
          </Col>
          <Col span={20}>
            <Select
              onChange={handleSelectChange}
              placeholder='Chọn loại hình kinh doanh'
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
              className='w-72'
              name='email'
              value={state.businessEmail}
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
              className='w-72'
              name='tax_code'
              value={state.businessTaxCode}
              onChange={handleInputChange}
            />
            {state.touched.tax_code && state.errors.tax_code && <div className='text-red-500 ml-5'>{state.errors.tax_code}</div>}

          </Col>
        </Row>
      </div>
    </div>
  )
}

export default TaxInformation