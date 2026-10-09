import moment from 'moment';

const dateFilterLabels = [
    { label: "All", value: "all" },
    { label: "Last 7 days", value: "last_7_days" },
    // { label: "Last month", value: 'last_month' },
    { label: "Last 30 days", value: "last_30_days" },
    // { label: "Last Year", value: 'last_year' },
    { label: "This Year", value: "this_year" },
];

const getFilterDate = (value) => {
     if (value === "last_7_days") {
        return {
            startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD')
        }
    }
     else if (value === "this_month") {
        return {
            startDate: moment().startOf('month').format('YYYY-MM-DD'),
            endDate: moment().endOf('month').format('YYYY-MM-DD') 
        }
    } else if (value === "last_30_days") {
        return {
            startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD')
        }
    } else if (value === "this_year") {
        return {
            startDate: moment().startOf('year').format('YYYY-MM-DD'),
            endDate: moment().endOf('year').format('YYYY-MM-DD') 
        }
    } else if (value === "last_year") {
        return {
            startDate: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD') 
        }
    }
    return {
        startDate: null,
        endDate: null 
    }

}

const LastThirtyDays = () => {
    return [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
}

export  { dateFilterLabels, getFilterDate, LastThirtyDays }