<template>
    <table class="wpf_regular_table" style="position: relative">
        <thead>
            <tr>
                <th>
                    <label>{{ $t('Item')}}</label>
                </th>
                <th >
                    {{ $t('Price')}}
                </th>
                <th>
                    {{ $t('Qty')}}
                </th>
                <th>
                    {{ $t('Line Total')}}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Product 1</td>
                <td>
                    1000
                </td>
                <td>2</td>
                <td>2000</td>
            </tr>
            <tr>
                <td>Product 2</td>
                <td>
                    500
                </td>
                <td>2</td>
                <td>1000</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td :colspan="3" style="text-align: right;">
                    Total
                </td>
                <td>3000</td>
            </tr>
        </tfoot>
    </table>
</template>
<script>

</script>
<style scoped>
    /* .wpf_regular_table {
        width: 100%;
        border-collapse: collapse;
    }
    .wpf_regular_table th, .wpf_regular_table td {
        border: 1px solid #ddd;
        padding: 8px;
    }
    .wpf_regular_table th {
        padding-top: 5px;
        padding-bottom: 5px;
        text-align: left;
        background-color: #e3e8ee;
        color: rgb(19, 18, 18);
    }
    .wpf_regular_table {
        empty-cells: show;
        font-size: 14px;
        border: 1px solid #cbcbcb;
    } */
</style>