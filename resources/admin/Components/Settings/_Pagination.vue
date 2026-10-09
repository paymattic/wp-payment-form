<template>
        <!-- <el-pagination class="wppayform-pagination"
            :background="false"
            layout="total, sizes, prev, pager, next"
            @current-change="changePage"
            @size-change="changeSize"
            :hide-on-single-page="true"
            :current-page.sync="pagination.current_page"
            :page-sizes="page_sizes"
            :page-size="pagination.per_page"
            :total="pagination.total"
    /> -->
    <div class="wpf_pagination" v-if="showPagination">
        <div class="pager-wrap">
            <span class="text">Page 1 to {{ pagination.per_page }} of {{ pagination.total }}</span>
            <el-select v-model="pagination.per_page" placeholder="Select">
                <el-option v-for="item in page_sizes" :key="item" :label="item + ' Per page'" :value="item" />
            </el-select>
        </div>

        <div class="pagination_page_list">
            <el-pagination @size-change="changeSize" @current-change="changePage"
                :current-page.sync="pagination.current_page" :page-sizes="page_sizes"
                :page-size="pagination.per_page" layout="prev, pager, next" :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script type="text/babel">
export default {
    name: 'Pagination',
    props: {
        pagination: {
            required: true,
            type: Object
        }
    },
    watch: {
        'pagination.per_page' (newVal) {
            this.changeSize(newVal);
        }
    },
    computed: {
        page_sizes() {
            const sizes = [];
            if (this.pagination.per_page < 10) {
                sizes.push(this.pagination.per_page);
            }

            const defaults = [
                10,
                20,
                50,
                80,
                100,
                120,
                150
            ];

            return [...sizes, ...defaults];
        },
        showPagination() {
            const totalPages = Math.ceil(this.pagination.total / this.pagination.per_page);
            return totalPages > 1 || this.pagination.per_page > 10;
        },
    },
    methods: {
        changePage(page) {
            this.pagination.current_page = page;
            this.$emit('fetch', this.pagination);
        },
        changeSize(size) {
            this.pagination.per_page = size;
            this.$emit('fetch', this.pagination);
        }
    }
}
</script>
