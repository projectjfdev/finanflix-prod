import React from 'react';
//as
interface LogoSvgProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  fill?: string;
}

const LogoSvg: React.FC<LogoSvgProps> = ({
  width = 175,
  height = 24,
  className,
  fill = '#E4E0F0',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 175 24"
    fill="none"
    className={className}
  >
    <path d="M3.85489 23.2863H0V0.0341797H15.4809V3.92318H3.85489V23.2863Z" fill={fill} />
    <path d="M14.9145 9.69629H7.01367V13.6194H14.9145V9.69629Z" fill="#FF3701" />
    <path d="M20.4336 0.0341797H24.2885V23.2863H20.4336V0.0341797Z" fill={fill} />
    <path
      d="M29.2402 0L44.7212 13.939V0H48.6102V23.2521V23.218V23.2862L33.1019 9.34724V23.2521H29.2471V0H29.2402Z"
      fill={fill}
    />
    <path
      d="M66.5716 15.5424L63.1534 8.70596L59.7352 15.5424L57.8248 19.3973L55.8462 23.2863H51.5273L63.1534 0.0341797L74.7795 23.2863H70.4606L68.5161 19.3973"
      fill={fill}
    />
    <path
      d="M77.7031 0L93.1841 13.939V0H97.0731V23.2521V23.218V23.2862L81.5648 9.34724V23.2521H77.7099V0H77.7031Z"
      fill={fill}
    />
    <path
      d="M117.502 0.0341797V3.92318H105.876V9.93407H117.502V13.8572H105.876V23.2931H102.021V0.0410013H117.502V0.0341797Z"
      fill={fill}
    />
    <path d="M122.463 0.0341797H126.318V19.3973H137.944V23.2863H122.463V0.0341797Z" fill={fill} />
    <path d="M142.896 0.0341797H146.751V23.2863H142.896V0.0341797Z" fill={fill} />
    <path
      d="M169.895 0.0341797H174.821L165.74 11.6602L174.821 23.2863H169.895L163.263 14.8124L156.665 23.2863H151.705L160.82 11.6602L151.705 0.0341797H156.665L163.263 8.5081L169.895 0.0341797Z"
      fill={fill}
    />
  </svg>
);

export default LogoSvg;
