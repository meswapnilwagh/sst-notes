import react from 'react';
import Button from 'react-bootstrap/Button';
import { BsArrowRepeat } from 'react-icons/bs';
import "./LoaderButton.css"
interface ILoadButton {
    [key: string]: any;
    isLoading: boolean;
    className?: string;
    disabled?: boolean;
}
const LoaderButton = ({
    isLoading,
    className = "",
    disabled = false,
    ...props
}: ILoadButton) => {
    return (
        <Button
            disabled={disabled || isLoading}
            className={`LoaderButton ${className}`}
            {...props}>
            {isLoading && <BsArrowRepeat className='spinning' />}
            {props.children}
        </Button>
    )
}

export default LoaderButton