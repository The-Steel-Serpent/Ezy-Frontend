import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shop_id: "",
    shop_name: "",
    logo_url: "",
    shop_description: "",
    business_style_id: "",
    tax_code: "",
    business_email: "",
    total_reviews: "",
    total_ratings: "",
    province_id: "",
    district_id: "",
    ward_code: "",
    shop_address: "",
    citizen_number: "",
    full_name: "",
    user_id: "",
};

export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        setShop: (state, action) => {
            state.shop_id = action.payload.shop_id;
            state.shop_name = action.payload.shop_name;
            state.logo_url = action.payload.logo_url;
            state.shop_description = action.payload.shop_description;
            state.business_style_id = action.payload.business_style_id;
            state.tax_code = action.payload.tax_code;
            state.business_email = action.payload.business_email;
            state.total_reviews = action.payload.total_reviews;
            state.total_ratings = action.payload.total_ratings;
            state.province_id = action.payload.province_id;
            state.district_id = action.payload.district_id;
            state.ward_code = action.payload.ward_code;
            state.shop_address = action.payload.shop_address;
            state.citizen_number = action.payload.citizen_number;
            state.full_name = action.payload.full_name;
            state.user_id = action.payload.user_id;
        },
        logoutShop: (state) => {
            state.shop_id = "";
            state.shop_name = "";
            state.logo_url = "";
            state.shop_description = "";
            state.business_style_id = "";
            state.tax_code = "";
            state.business_email = "";
            state.total_reviews = "";
            state.total_ratings = "";
            state.province_id = "";
            state.district_id = "";
            state.ward_code = "";
            state.shop_address = "";
            state.citizen_number = "";
            state.full_name = "";
            state.user_id = "";
        },
    
    },
});

// Action creators are generated for each case reducer function
export const { setShop, logoutShop } =
    shopSlice.actions;

export default shopSlice.reducer;
