import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function CharBarra({ options }) {

    return (
        <>
            <br />
           
            <HighchartsReact highcharts={Highcharts} options={options} />
        </>
    )
}