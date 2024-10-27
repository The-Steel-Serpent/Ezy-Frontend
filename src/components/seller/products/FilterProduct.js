import React, { useEffect, useReducer } from 'react'
import { Button, Input } from 'antd';
import { CiSearch } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";
import ModalShopCategory from '../category/ModalShopCategory';

const initialState = {
  isCatModalVisible: false,
  selectedSubcat: null,
  search_product_name: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CAT_MODAL_VISIBLE':
      return { ...state, isCatModalVisible: action.payload };
    case 'SET_SELECTED_SUBCAT':
      return { ...state, selectedSubcat: action.payload };
    case 'SET_SEARCH_PRODUCT_NAME':
      return { ...state, search_product_name: action.payload }
    default:
      return state;
  }
};

const FilterProduct = ({ handleSetSearchInfo }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showCatModal = () => {
    dispatch({ type: 'SET_CAT_MODAL_VISIBLE', payload: true });
  };
  const handleCatOK = (subcategory) => {
    dispatch({ type: 'SET_SELECTED_SUBCAT', payload: subcategory });
    dispatch({ type: 'SET_CAT_MODAL_VISIBLE', payload: false });
  };

  const handleCatCancel = () => {
    dispatch({ type: 'SET_SELECTED_SUBCAT', payload: null });
    dispatch({ type: 'SET_CAT_MODAL_VISIBLE', payload: false });
  };

  const handleApplyFilter = () => {
    handleSetSearchInfo(state.search_product_name, state.selectedSubcat?.sub_category_id);
  }

  const handleResetFilter = () => {
    dispatch({ type: 'SET_SELECTED_SUBCAT', payload: null });
    dispatch({ type: 'SET_SEARCH_PRODUCT_NAME', payload: '' });
    handleSetSearchInfo(null, null);
  }


  return (
    <div className='flex items-center gap-3 w-full bg-white p-5 rounded'>
      <Input
        value={state?.search_product_name ?? ''}
        onChange={(e) => dispatch({ type: 'SET_SEARCH_PRODUCT_NAME', payload: e.target.value })}
        placeholder="Tìm tên sản phẩm"
        prefix={<CiSearch />}
      />
      <Input
        value={state?.selectedSubcat?.sub_category_name ?? ''}
        placeholder="Tìm theo ngành hàng"
        readOnly
        onClick={showCatModal}
        suffix={<BsPencil />}
      />
      <Button
        className='text-primary border rounded border-primary px-4 py-2 font-[500] hover:text-white'
        onClick={handleApplyFilter}
      >
        Áp dụng
      </Button>
      <Button
        onClick={handleResetFilter}
        className='text-primary border rounded border-primary px-4 py-2 font-[500] hover:text-white'>
        Đặt lại
      </Button>
      <ModalShopCategory
        isCatModalVisible={state.isCatModalVisible}
        handleCatOK={handleCatOK}
        handleCatCancel={handleCatCancel}
      />
    </div>
  )
}

export default FilterProduct