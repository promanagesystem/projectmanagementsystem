import { ImgHTMLAttributes } from 'react';

interface AppLogoIconProps extends ImgHTMLAttributes<HTMLImageElement> {}

export default function AppLogoIcon(props: AppLogoIconProps) {
    return (
        <img
            {...props}
            src="/logosyntera.png"
            alt={props.alt || "SysManagePro Logo"}
        />
    );
}
