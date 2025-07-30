import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const Followers = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#313132"
      fillRule="evenodd"
      d="M12.544 11h-8.21c-1.335 0-2.54.825-3.1 2.093-.388.855-.776 1.726-.977 2.17-.56 1.19-.186 2.321.933 2.871 1.737.855 3.546 1.467 5.44 1.741 2.125.29 4.206.062 6.259-.565 1.02-.32 2.01-.718 2.971-1.191 1.02-.52 1.421-1.635.933-2.72-.23-.534-.746-1.558-1.234-2.49C14.97 11.733 13.808 11 12.544 11Z"
      clipRule="evenodd"
    />
    <Path
      fill="#313132"
      d="M12.5 4.5c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4ZM18.5 5a1 1 0 1 0-2 0v1.5H15a1 1 0 1 0 0 2h1.5V10a1 1 0 1 0 2 0V8.5H20a1 1 0 1 0 0-2h-1.5V5Z"
    />
  </Svg>
);

export const More = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={6}
    fill="none"
    {...props}
  >
    <Path
      fill="#313132"
      d="M5 3a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM12.5 3a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM20 3a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
    />
  </Svg>
);

export const Search = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      fill="#313132"
      fillRule="evenodd"
      d="M3.5 10a6.5 6.5 0 1 1 13 .002 6.5 6.5 0 0 1-13-.003ZM10 .5C4.751.5.5 4.754.5 10c0 5.248 4.254 9.5 9.5 9.5 2.081 0 4.007-.67 5.573-1.806l3.366 3.367a1.5 1.5 0 0 0 2.122-2.122l-3.367-3.366A9.458 9.458 0 0 0 19.5 9.999C19.5 4.752 15.245.5 10 .5Z"
      clipRule="evenodd"
    />
  </Svg>
);
