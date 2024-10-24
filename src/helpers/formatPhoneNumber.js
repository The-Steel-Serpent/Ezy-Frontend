export const checkNumberPhone = (phoneNumber) => {
    // Head number phone Viettel 
    const viettel = ['086', '096', '097', '039', '038', '037', '036', '035', '034', '033', '032'];

    // Head number phone Vinaphone
    const vinaphone = ['091', '094', '088', '083', '084', '085', '081', '082'];

    // Head number phone Mobifone
    const mobifone = ['070', '079', '077', '076', '078', '089', '090', '093'];

    // Head number phone Vietnamobile
    const vietnamobile = ['092', '052', '056', '058'];

    // Head number phone Gmobile
    const gmobile = ['099', '059'];

    // Head number Itelecom
    const itelecom = ['087'];

    // Concatenate all arrays into one
    const allPhoneNumbers = [...viettel, ...vinaphone, ...mobifone, ...vietnamobile, ...gmobile, ...itelecom];

    if (phoneNumber === "") {
        return "Không được bỏ trống số điện thoại";
    }

    if (phoneNumber.length === 10) {
        const phonePrefix = phoneNumber.substring(0, 3);
        if (allPhoneNumbers.includes(phonePrefix)) {
            return "";
        } else {
            // Invalid phone number
            return "Số điện thoại không hợp lệ";
        }
    } else {
        // Invalid phone number length
        return "Yêu cầu nhập đúng 10 số";
    }
};