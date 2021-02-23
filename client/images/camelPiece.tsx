import * as React from 'react';

interface CamelPieceProps {
    fill: string;
    stroke: string;
}

export default ({ fill, stroke }: CamelPieceProps) => {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.20239 482.34051" id="svg4296" version="1.1">
        <defs id="defs4298"/>
        <g id="layer1" transform="translate(1631.9182,707.88814)">
            <path fill={fill} stroke={stroke} strokeWidth="20" strokeLinecap="square" d="m -1522.7581,-707.8851 c -2.3081,-0.0542 -4.8268,0.61729 -7.6211,1.98438 -5.0301,2.46099 -5.6031,2.54251 -10.5937,1.51172 -2.9021,-0.59943 -8.099,-1.08985 -11.5469,-1.08985 -5.8744,0 -6.5014,0.21061 -9.9824,3.35547 -5.7975,5.23765 -10.7827,6.24604 -31.916,6.45313 -11.1084,0.10885 -19.2806,0.59713 -20.8282,1.24414 -1.7195,0.71887 -3.5132,2.97945 -5.5195,6.95898 -1.6344,3.24194 -4.8126,7.6124 -7.0625,9.71094 -3.701,3.45205 -4.0898,4.23091 -4.0898,8.19336 0,3.3345 0.4389,4.65368 1.8379,5.52734 1.658,1.03548 1.6973,1.30188 0.4062,2.72852 -0.899,0.99337 -1.321,2.90464 -1.1348,5.14258 0.2387,2.86768 0.8827,3.90333 3.3047,5.3125 4.8274,2.80859 12.2524,3.1552 17.5352,0.81835 l 4.457,-1.9707 3.4375,2.71875 c 1.8908,1.49601 7.3878,4.32288 12.2168,6.28125 4.8291,1.95838 8.9102,3.99571 9.0684,4.52735 0.1581,0.53163 0.5331,2.45883 0.834,4.2832 0.3008,1.82436 2.8969,7.27696 5.7695,12.11523 7.5247,12.67375 7.6956,13.3371 8.2031,31.91211 0.4912,17.97524 2.2881,30.25344 7.6406,52.22266 8.7811,36.0413 18.3987,56.87543 32.834,71.12695 8.3621,8.25562 14.7136,11.67384 34.6836,18.66992 l 17.8125,6.24024 0.1016,9.07421 c 0.058,4.99004 1.2279,16.55747 2.6015,25.70508 3.7785,25.16223 4.0663,32.57458 1.5723,40.55469 -1.8315,5.86013 -1.9868,7.81674 -1.4473,18.28125 0.5976,11.59009 0.5669,11.84741 -2.8652,23.4375 -1.9086,6.44531 -4.1962,14.71993 -5.084,18.38867 -0.8878,3.66872 -3.4515,9.99685 -5.6972,14.0625 -7.3727,13.34733 -9.3782,17.66642 -9.9629,21.46094 -0.714,4.63335 -1.5403,5.70256 -6.3477,8.22266 -2.9189,1.5301 -5.7577,2.04927 -12.1074,2.21289 -9.7987,0.25249 -11.8613,1.45951 -11.8613,6.93359 0,3.75914 1.9066,6.14253 4.207,5.25977 1.0013,-0.38426 1.4215,0.0666 1.4316,1.53515 0.035,5.11656 3.1868,6.30711 16.5645,6.25781 12.8924,-0.0475 18.288,-0.90594 21.7265,-3.45703 3.5575,-2.63932 5.1672,-8.05537 4.0684,-13.68945 -0.712,-3.651 -0.5553,-5.39481 0.8086,-8.98438 0.9309,-2.44997 3.2184,-10.95747 5.084,-18.90624 1.8656,-7.94876 5.4795,-21.39523 8.0312,-29.87891 2.5518,-8.48368 4.6407,-15.79168 4.6407,-16.24219 0,-0.45052 1.1921,-2.01243 2.6503,-3.4707 3.3519,-3.35182 6.7145,-13.4266 7.3594,-22.04883 0.381,-5.09366 1.283,-8.13625 4.0293,-13.59375 4.3026,-8.54995 6.6072,-15.52565 10.3008,-31.17969 3.9819,-16.87585 12.1431,-37.95767 16.6914,-43.11719 4.0926,-4.64256 8.1154,0.13938 13.3399,15.85938 2.1992,6.61728 8.7417,22.78906 14.539,35.9375 11.4934,26.06733 12.3107,28.6594 13.5332,42.88477 0.7071,8.22821 1.3193,10.60314 4.2735,16.58203 l 3.4472,6.97656 0,26.07617 c 0,28.3859 -1.0777,42.68003 -3.3965,45.24219 -0.7984,0.88229 -1.4511,2.29371 -1.4511,3.13476 0,0.98928 -1.4067,1.94316 -3.9844,2.70508 -5.6135,1.6593 -13.8281,9.89436 -13.8281,13.86133 0,3.20498 2.4431,4.72461 7.5937,4.72461 2.5035,0 2.683,0.19133 1.7715,1.89453 -0.5576,1.0419 -0.7221,2.36598 -0.3652,2.94336 0.4493,0.72702 4.0608,0.89331 11.75,0.53906 12.631,-0.58196 17.9413,-2.43832 21.9316,-7.66992 2.8959,-3.79643 2.8929,-4.86369 -0.025,-9.1582 -1.289,-1.89704 -2.3426,-3.78906 -2.3418,-4.20313 8e-4,-0.41408 4.325,-0.75195 9.6094,-0.75195 7.9269,0 10.2636,-0.34355 13.3574,-1.96094 3.1886,-1.66689 3.7938,-2.46668 4.0391,-5.34961 0.1588,-1.8648 -0.1388,-4.18813 -0.6602,-5.16211 -0.7734,-1.44527 -0.4531,-2.13669 1.7422,-3.75976 3.1568,-2.3339 5.9789,-9.24353 8.5352,-20.89844 2.5202,-11.49024 6.8807,-23.35429 12.3691,-33.65039 15.6569,-29.37219 17.3374,-33.99553 19.9278,-54.84375 2.0594,-16.57398 4.892,-27.66425 13.2148,-51.73242 3.8902,-11.25023 8.535,-25.51758 10.3203,-31.70508 3.5646,-12.3537 5.3572,-15.12637 9.1602,-14.17187 3.5115,0.88131 5.3439,4.97069 4.2812,9.55273 -1.3851,5.97205 -1.055,20.15198 0.5996,25.77734 0.8239,2.80061 3.7491,9.31055 6.5,14.4668 6.2395,11.69581 9.3983,21.03106 10.879,32.15234 1.0237,7.68945 0.9763,9.00908 -0.4258,11.94922 -0.8669,1.81784 -1.5762,5.42397 -1.5762,8.01172 0,5.88764 2.4812,17.08789 4.8027,21.67774 1.2649,2.50099 1.7653,5.5302 1.7793,10.78125 0.011,4.01664 0.6377,15.31835 1.3926,25.11523 1.7895,23.21773 1.8393,45.415 0.1113,49.55078 -1.7393,4.16288 -6.5063,9.44786 -12.5546,13.91602 -5.5994,4.13644 -7.4333,7.48129 -5.92,10.80273 0.7791,1.70992 1.7292,2.13672 4.7617,2.13672 3.5145,0 3.7467,0.16017 3.2305,2.2168 -0.7405,2.95029 0.658,3.40922 12.416,4.07812 10.5891,0.60241 14.0916,-0.25435 17.1992,-4.20508 2.4736,-3.14459 2.321,-7.5728 -0.4902,-14.25195 -2.0889,-4.96307 -2.5305,-8.36026 -4.2187,-32.44922 -2.2487,-32.08603 -2.3121,-40.93457 -0.4453,-61.32617 2.5498,-27.85383 2.6766,-33.55295 0.9121,-40.78125 -2.4403,-9.997 -2.8661,-26.17409 -1.0196,-38.7207 2.081,-14.14053 11.5356,-55.40533 13.4981,-58.91211 0.4499,-0.804 2.6581,0.41556 7.207,3.98437 6.0875,4.77593 25.611,15.36719 28.3281,15.36719 1.6097,0 1.5138,-3.99147 -0.1953,-8.08203 -2.2597,-5.40807 -7.0471,-10.71614 -13.0996,-14.52735 -9.2053,-5.79646 -9.7899,-6.33486 -12.4082,-11.42578 -2.75,-5.34692 -2.7635,-5.57206 -1.4922,-26.82422 1.5381,-25.71299 -0.1144,-34.02283 -12.1426,-61.01562 -6.0219,-13.51396 -12.5391,-23.35415 -18.9453,-28.60352 -4.6073,-3.77531 -8.1608,-9.88971 -10.3437,-17.80273 -2.5404,-9.20914 -9.0258,-29.7299 -10.6192,-33.60156 -2.2347,-5.42994 -9.0684,-11.53482 -17.705,-15.81445 -6.6878,-3.31395 -8.5611,-3.82713 -14.0801,-3.85938 -11.66,-0.0681 -14.5555,2.87725 -26.3125,26.77149 -7.8111,15.8749 -8.3008,16.62201 -10.9278,16.64062 -2.0771,0.0147 -3.829,-1.09903 -7.1543,-4.54883 -5.2787,-5.47665 -7.862,-11.74224 -10.4824,-25.43164 -2.7478,-14.35456 -3.2907,-16.25926 -5.6484,-19.75781 -4.9878,-7.40146 -14.2069,-10.71924 -27.8106,-10.00781 -11.0717,0.579 -17.3602,2.83157 -24.9297,8.92968 -7.4457,5.99837 -12.0997,12.90543 -14.9238,22.14844 -3.1644,10.35642 -6.5488,15.28824 -14.7129,21.43555 -9.9389,7.4837 -17.5359,17.26167 -27.4863,35.37695 -6.654,12.11393 -13.1919,21.08176 -19.5645,26.83594 -7.3001,6.59169 -10.6749,7.80792 -21.7246,7.82812 -10.7663,0.0196 -14.6621,-1.5533 -16.8398,-6.79492 -2.3289,-5.60536 -5.4618,-33.09338 -5.5274,-48.49414 -0.058,-13.69269 0.085,-14.89774 2.4805,-20.88086 4.3443,-10.84941 3.1026,-21.23845 -4.0059,-33.49414 -1.9439,-3.35156 -4.8297,-8.67429 -6.4121,-11.82812 -3.7402,-7.45444 -7.801,-11.08399 -12.8789,-11.20313 z m 211.5391,266.67578 c 0.1376,0.0168 0.2391,0.0543 0.3008,0.11524 1.4557,1.43769 1.8175,19.55998 0.6074,30.41796 -0.896,8.03907 -0.9196,13.92148 -0.1015,25.875 1.4677,21.44841 0.3411,32.27174 -6.0391,57.9961 -8.2915,33.43061 -12.6004,43.52062 -23.2461,54.43359 -5.5403,5.67932 -10.4931,9.08397 -11.2715,7.74805 -0.2242,-0.38482 -1.2885,-4.4961 -2.3652,-9.13672 -4.6193,-19.90893 -4.7564,-38.88113 -0.4082,-56.71875 2.8164,-11.55353 3.1105,-22.63646 0.8457,-31.875 -1.9901,-8.11738 -1.9011,-16.0393 0.3476,-31.08789 1.2913,-8.64119 1.875,-17.35895 1.875,-28.20899 0,-8.63671 0.2455,-15.70312 0.5371,-15.70312 0.2918,0 1.3655,0.4476 2.3868,0.99414 1.0212,0.54655 4.1607,1.36789 6.9765,1.82617 6.8529,1.11532 14.4764,-0.31983 22.541,-4.24414 3.3143,-1.6128 6.0506,-2.54929 7.0137,-2.43164 z" id="path8055"/>
        </g>
        </svg>
    )
};