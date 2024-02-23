import { RiExchangeDollarFill } from "react-icons/ri"
import { Radio } from 'antd';
import { BsFillInboxesFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { updatePayCartSet, PayMethod } from "app/cartSlice";
import { RadioChangeEvent } from "antd/lib/radio";

export const CartPayment = (props) => {
    const dispatch = useDispatch();
    
    function handleChange(e: RadioChangeEvent) { 
        const type = e.target.value == 2 ? PayMethod.pickup : PayMethod.cod;

        dispatch(updatePayCartSet({payMethod: type}))
    }

    return(
        <div className="cart_payment">
            <h5 className="title">Hình thức di chuyển</h5>
            <Radio.Group name="radiogroup" defaultValue={1} className="cart_group" onChange={handleChange}>
                <Radio value={1} className="cart_ratio">
                    <span className="input">
                        <RiExchangeDollarFill className="icon"/>
                        <span>
                            <p>Hỗ trợ di chuyển</p>
                        </span>
                    </span>
                </Radio>
                <Radio value={2} className="cart_ratio">
                    <span className="input">
                        <BsFillInboxesFill className="icon"/>
                        <span>
                            <p>Phương thức cá nhân</p>
                        </span>
                    </span>
                </Radio>
            </Radio.Group>
        </div>
    )
}