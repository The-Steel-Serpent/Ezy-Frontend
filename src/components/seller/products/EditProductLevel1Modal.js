import { Button, Col, Input, message, Modal, Row, Upload } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useReducer } from 'react'
import { GoPlus } from "react-icons/go";
import { RiImageAddFill } from 'react-icons/ri';
import { CiSquarePlus, CiSquareRemove } from "react-icons/ci";
const initialState = {
  visible_btn_add_classify: true,
  visible_btn_add_varient: true,
  classify_rows: [],
  classify_type: null,
  classifies_image: [],
  classifies_name: [],
  varient_type: null,
  varient_rows: [],
  varient_name: [],
  errors: {
    classify_type: 'Chưa nhập tên phân loại',
    varient_type: 'Chưa nhập tên phân loại'
  },
  touchs: {
    classify_type: false,
    varient_type: false
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VISIBLE_BTN_ADD_CLASSIFY':
      return { ...state, visible_btn_add_classify: action.payload }
    case 'SET_VISIBLE_ADD_VARIENT':
      return { ...state, visible_btn_add_varient: action.payload }
    case 'SET_CLASSIFY_ROWS':
      return { ...state, classify_rows: action.payload }
    case 'SET_CLASSIFY_TYPE':
      return { ...state, classify_type: action.payload }
    case 'SET_CLASSIFIES_IMAGE':
      return { ...state, classifies_image: action.payload }
    case 'SET_CLASSIFIES_NAME':
      return { ...state, classifies_name: action.payload }
    case 'SET_VARIENT_ROWS':
      return { ...state, varient_rows: action.payload }
    case 'SET_VARIENT_TYPE':
      return { ...state, varient_type: action.payload }
    case 'SET_VARIENTS_NAME':
      return { ...state, varient_name: action.payload }
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.payload.name]: action.payload.value } }
    case 'SET_TOUCH':
      return { ...state, touchs: { ...state.touchs, [action.payload.name]: action.payload.value } }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const EditProductLevel1Modal = forwardRef(({ visible, onCancel, product }, ref) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
      className='mt-2'
    >
      {<RiImageAddFill size={30} />}
    </button>
  );

  const resetState = () => {
    dispatch({ type: 'RESET' })
  }

  useImperativeHandle(ref, () => ({
    resetState,
  }));

  const beforeUpload = file => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      message.error('Kích thước tập tin vượt quá 2.0 MB');
      return Upload.LIST_IGNORE;
    }
    return true;
  };



  const handleClassifyTypeChange = (value) => {
    dispatch({ type: 'SET_TOUCH', payload: { name: 'classify_type', value: true } })
    dispatch({ type: 'SET_CLASSIFY_TYPE', payload: value })
    if (value === '') {
      dispatch({ type: 'SET_ERROR', payload: { name: 'classify_type', value: 'Hãy nhập tên phân loại' } })
    }
    else {
      dispatch({ type: 'SET_ERROR', payload: { name: 'classify_type', value: '' } })
    }
  }
  // classify
  const handleAddProductClassify = () => {
    dispatch({ type: 'SET_VISIBLE_BTN_ADD_CLASSIFY', payload: false })
  }
  const handleAddClassifyRow = () => {
    const newClassifyRow = {
      key: state.classify_rows.length + 1,
      classify_image: [],
      classify_name: '',
      error_classify_name: '',
      error_classify_image: 'Hãy chọn ảnh của phân loại',
      touch: false
    };
    dispatch({ type: 'SET_CLASSIFY_ROWS', payload: [...state.classify_rows, newClassifyRow] });
  };

  const handleRemoveClassifyRow = (key) => {
    const newClassifyRows = state.classify_rows.filter(row => row.key !== key)
    dispatch({ type: 'SET_CLASSIFY_ROWS', payload: newClassifyRows })
  }

  const handleInputClassifyNameChange = (key, value) => {
    const isDuplicate = value !== '' && state.classify_rows.some(row => row.classify_name === value && row.key !== key);
    const updatedRows = state.classify_rows.map(row =>
      row.key === key
        ? {
          ...row,
          classify_name: value,
          error_classify_name: value === '' ? 'Hãy nhập phân loại' : isDuplicate ? 'Phân loại không được trùng' : '',
          touch: true,
        }
        : row
    );
    dispatch({ type: 'SET_CLASSIFY_ROWS', payload: updatedRows });
  };
  const handleUploadClassifyImageChange = (key, { fileList }) => {
    const updatedRows = state.classify_rows.map(row =>
      row.key === key ? {
        ...row,
        classify_image: fileList,
        error_classify_image: fileList.length === 0 ? 'Hãy chọn ảnh của phân loại' : '',
        touch: true,
      } : row
    );
    dispatch({ type: 'SET_CLASSIFY_ROWS', payload: updatedRows });
  };

  const handleRemoveClassifyImage = (key) => {
    const newClassifyImage = state.classifies_image.filter((image, index) => index !== key)
    dispatch({ type: 'SET_CLASSIFIES_IMAGE', payload: newClassifyImage })
  }

  // varient

  const handleAddVarient = () => {
    dispatch({ type: 'SET_VISIBLE_ADD_VARIENT', payload: !state.visible_btn_add_varient })
    if (!state.visible_btn_add_varient) {
      // reset state
      dispatch({ type: 'SET_VARIENT_TYPE', payload: null })
      dispatch({ type: 'SET_TOUCH', payload: { name: 'varient_type', value: false } })
      dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: 'Hãy nhập tên phân loại' } })
      dispatch({ type: 'SET_VARIENT_ROWS', payload: [] });
    }
  }

  const handleVarientTypeChange = (value) => {
    dispatch({ type: 'SET_TOUCH', payload: { name: 'varient_type', value: true } })
    dispatch({ type: 'SET_VARIENT_TYPE', payload: value })
    if (value === '') {
      dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: 'Hãy nhập tên phân loại' } })
    }
    else {
      dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: '' } })
    }
  }

  const handleAddVarientRow = () => {
    const newVarientRow = {
      key: state.varient_rows.length + 1,
      varient_name: '',
      error_varient_name: '',
      touch: false
    };
    dispatch({ type: 'SET_VARIENT_ROWS', payload: [...state.varient_rows, newVarientRow] });
  };

  const handleRemoveVarientRow = (key) => {
    const newVarientRows = state.varient_rows.filter(row => row.key !== key)
    dispatch({ type: 'SET_VARIENT_ROWS', payload: newVarientRows })
  }

  const handleInputVarientNameChange = (key, value) => {
    const isDuplicate = value !== '' && state.varient_rows.some(row => row.varient_name === value && row.key !== key);
    const updatedRows = state.varient_rows.map(row =>
      row.key === key
        ? {
          ...row,
          varient_name: value,
          error_varient_name: value === '' ? 'Hãy nhập phân loại' : isDuplicate ? 'Phân loại không được trùng' : '',
          touch: true,
        }
        : row
    );
    dispatch({ type: 'SET_VARIENT_ROWS', payload: updatedRows });
  };

  useEffect(() => {
    console.log('classify_rows:', state.classify_rows);
  }, [
    state.classify_rows,
    state.classify_type,
    state.varient_type,
    state.varient_rows,
  ])

  useEffect(() => {
    if (product && product?.ProductVarients[0]?.ProductClassify == null) {
      console.log('Nhan level 1 duoc roi nha cam on:', product);
    }
  }, [product])
  return (
    <div>
      <Modal
        open={visible}
        title="Chỉnh sửa phân loại"
        onCancel={onCancel}
        centered={true}
      >
        <div>
          {
            state.visible_btn_add_classify ? (
              <div>
                <p>Chưa có phân loại</p>
                <Button
                  type="dashed"
                  icon={<GoPlus size={25} />}
                  className='text-sm'
                  onClick={handleAddProductClassify}
                >
                  Thêm nhóm phân loại
                </Button>
              </div>
            ) : (
              <div>
                <Row className='flex items-center mb-5 mt-5'>
                  <Col span={4}>
                    <div className='font-semibold'>Phân loại 1</div>
                  </Col>
                  <Col span={20}>
                    <Input
                      showCount
                      maxLength={15}
                      placeholder="Nhập tên phân loại"
                      value={state.classify_type}
                      onChange={(e) => handleClassifyTypeChange(e.target.value)}
                    />
                    {state.errors.classify_type && state.touchs.classify_type && (<div className='text-red-500 text-sm'>{state.errors.classify_type}</div>)}
                  </Col>
                </Row>
                {state.classify_rows.map((row) => (
                  <Row key={row.key} className='flex items-center mb-2' gutter={10}>
                    <Col span={6}>
                      <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={true}
                        fileList={row.classify_image}
                        maxCount={1}
                        beforeUpload={beforeUpload}
                        onChange={({ fileList }) => handleUploadClassifyImageChange(row.key, { fileList })}
                        onRemove={() => handleRemoveClassifyImage(row.key)}
                      >
                        {row.classify_image.length < 1 && (
                          uploadButton
                        )}
                      </Upload>
                    </Col>
                    <Col span={16}>
                      <Input
                        value={row.classify_name}
                        showCount
                        maxLength={20}
                        placeholder="Nhập phân loại"
                        onChange={(e) => handleInputClassifyNameChange(row.key, e.target.value)}
                      />
                      {row.error_classify_name && row.touch && (<div className='text-red-500 text-sm'>{row.error_classify_name}</div>)}
                      {row.error_classify_image && row.touch && (<div className='text-red-500 text-sm'>{row.error_classify_image}</div>)}
                    </Col>
                    <Col span={2}>
                      <CiSquareRemove
                        size={25}
                        className='cursor-pointer'
                        onClick={() => handleRemoveClassifyRow(row.key)}
                        color='#ff4d4f' />
                    </Col>
                  </Row>
                ))}
                <CiSquarePlus
                  size={30}
                  onClick={handleAddClassifyRow}
                  className='mx-auto cursor-pointer'
                  color='#327bb3'
                />
                {state.visible_btn_add_varient ? (
                  <div>
                    <p className='font-semibold'>Phân loại 2</p>
                    <Button
                      type="dashed"
                      icon={<GoPlus size={25} />}
                      className='text-sm'
                      onClick={handleAddVarient}
                    >
                      Thêm nhóm phân loại 2
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Row className='flex items-center mb-5 mt-5' gutter={10}>
                      <Col span={4}>
                        <div className='font-semibold'>Phân loại 2</div>
                      </Col>
                      <Col span={18}>
                        <Input
                          showCount
                          maxLength={15}
                          placeholder="Nhập tên phân loại"
                          value={state.varient_type}
                          onChange={(e) => handleVarientTypeChange(e.target.value)}
                        />
                        {state.errors.varient_type && state.touchs.varient_type && (<div className='text-red-500 text-sm'>{state.errors.varient_type}</div>)}
                      </Col>
                      <Col span={2}>
                        <CiSquareRemove
                          size={25}
                          className='cursor-pointer'
                          onClick={handleAddVarient}
                          color='#ff4d4f' />
                      </Col>
                    </Row>
                    {state.varient_rows.map((row) => (
                      <Row key={row.key} className='flex items-center mb-2' gutter={10}>
                        <Col span={22}>
                          <Input
                            value={row.varient_name}
                            showCount
                            maxLength={20}
                            placeholder="Nhập phân loại"
                            onChange={(e) => handleInputVarientNameChange(row.key, e.target.value)}
                          />
                          {row.error_varient_name && row.touch && (<div className='text-red-500 text-sm'>{row.error_varient_name}</div>)}
                        </Col>
                        <Col span={2}>
                          <CiSquareRemove
                            size={25}
                            className='cursor-pointer'
                            onClick={() => handleRemoveVarientRow(row.key)}
                            color='#ff4d4f' />
                        </Col>
                      </Row>
                    ))}
                    <CiSquarePlus
                      size={30}
                      onClick={handleAddVarientRow}
                      className='mx-auto cursor-pointer'
                      color='#327bb3'
                    />
                  </div>
                )}

              </div>
            )

          }
        </div>
      </Modal>
    </div>
  )
});

export default EditProductLevel1Modal