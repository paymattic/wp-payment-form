<template>
    <div class="address_fields_wrapper">
        <p><strong>Address Fields:</strong></p>

        <!-- Native Draggable Table -->
        <table class="address-table">
            <thead>
                <tr>
                    <th width="40"></th>
                    <th width="130">Field Name</th>
                    <th>Default Value</th>
                    <th width="95">Visibility</th>
                    <th width="95">Required</th>
                    <th width="85">Action</th>
                </tr>
            </thead>

            <draggable v-model="data_fields[0]" handle=".drag-handle" ghost-class="ghost" @end="onDragEnd" tag="tbody">
                <tr v-for="field in data_fields[0]" :key="field.id">
                    <!-- Drag Handle -->
                    <td>
                        <div class="wpf_drag_handle drag-handle">
                            <Icon icon="wpf-drag" class="drag-handle" />
                        </div>
                    </td>

                    <!-- Field Name -->
                    <!-- <td>{{ fields[field.id] }}</td> -->
                     <td>
                        <LabelEditor v-model="field.label" class="wpf_address_field_label" />
                     </td>

                    <!-- Default Value -->
                    <td>
                        <div class="wp_vue_editor_wrapper">
                            <el-input v-model="field_options[field.id]['default_value']" size="small"
                                auto-complete="off">
                                <popover slot="suffix" :data="editorShortcodes" btnType="text"
                                    :style="disableStyle(editorShortcodes)" buttonText=""
                                    @command="(code) => { field_options[field.id]['default_value'] += code }" />
                            </el-input>
                        </div>
                    </td>

                    <!-- Visibility -->
                    <td style="text-align: center;">
                        <el-switch active-value="yes" inactive-value="no"
                            v-model="field_options[field.id]['visibility']" />
                    </td>

                    <!-- Required -->
                    <td style="text-align: center;">
                        <el-switch active-value="yes" inactive-value="no"
                            v-model="field_options[field.id]['required']" />
                    </td>

                    <!-- Actions -->
                    <td style="text-align: center;">
                        <el-tooltip v-if="isDefaultAddressField(field.id)" content="Default fields cannot be deleted" placement="top">
                            <el-button size="mini" icon="el-icon-delete" disabled />
                        </el-tooltip>
                        <el-button v-else @click="deleteField(field.id)" size="mini" icon="el-icon-delete" />
                    </td>
                </tr>
            </draggable>
        </table>

        <!-- Add More Button -->
        <div class="wpf_action_block" style="display: flex; gap: 20px; padding-top: 15px;">
            <div class="wpf_block-add_more">
                <Icon icon="wpf-black-add"/>
                <span class="wpf_block-add_more-button" @click="addMoreField">
                    Add More
                </span>
            </div>
        </div>
        <el-form v-if="field_options.country" class="country-dropdown">
            <el-form-item label="Country Settings">
            <div class="filter-mode-buttons">
                <el-radio-group v-model="field_options['country']['filterMode']" @change="handleFilterModeChange">
                    <el-tooltip v-for="(mode, index) in filterMode" :key="index" :content="getTooltipContent(index)" placement="top">
                        <el-radio-button :label="index">{{ mode }}</el-radio-button>
                    </el-tooltip>
                </el-radio-group>
            </div>
            </el-form-item>
            <el-form-item v-if="field_options['country']['filterMode'] !== 'all'" label="Select Countries">
            <div class="country-selector">                
                <el-popover
                ref="countryPopover"
                v-model="isDropdownOpen"
                placement="bottom"
                width="100%"
                trigger="manual"
                popper-class="country-selector-popover"
                >
                <!-- Trigger Element -->
                <div 
                    ref="countryTrigger"
                    slot="reference"
                    class="countries-container"
                    :class="{ 'focused': isDropdownOpen }"
                    @click="toggleDropdown"
                    style="margin-left: 210px;"
                >
                    <!-- Selected Countries Tags -->
                    <div class="selected-tags" v-if="selectedCountries.length">
                    <el-tag
                        v-for="(countryCode, index) in selectedCountries" 
                        :key="index"
                        class="country-tag"
                        closable
                        @close="removeCountry(countryCode)"
                        :disable-transitions="false"
                    >
                        {{ getCountryName(countryCode) }}
                    </el-tag>
                    </div>

                    <!-- Input Trigger -->
                    <div class="dropdown-trigger">
                    <span class="placeholder">Add or remove countries...</span>
                    <i class="el-icon-arrow-down arrow-icon"></i>
                    </div>
                </div>

                <!-- Dropdown Content -->
                <div class="dropdown-content">
                    <!-- Search Input -->
                    <el-input
                    v-model="searchQuery"
                    placeholder="Search countries..."
                    prefix-icon="el-icon-search"
                    size="small"
                    class="search-input"
                    clearable
                    />
                    <!-- Countries List -->
                    <div class="countries-list">
                    <el-checkbox-group v-model="selectedCountries">
                        <div
                        v-for="(country, code) in filteredCountries"
                        :key="code"
                        class="country-item"
                        :class="{ 'selected': isSelected(code) }"
                        >
                        <el-checkbox
                            :label="code"
                            class="country-checkbox"
                        >
                            <span class="country-name">{{ country }}</span>
                        </el-checkbox>
                        </div>
                    </el-checkbox-group>
                    </div>
                </div>
                <div class="close-dropdown" @click="closeDropdown">
                  <el-tooltip content="Close" placement="top">
                    <i class="el-icon-close close-icon"></i>
                  </el-tooltip>
                </div>
                </el-popover>

                <!-- Priority Label Input -->
                <el-input
                v-if="showPriorityLabel"
                v-model="field_options.country.priorityLabel"
                placeholder="Enter Priority Label"
                class="priority-input"
                />
            </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import popover from './input-popover-dropdown.vue'
    import Icon from '../Icons/Index.vue';
    import draggable from 'vuedraggable'
    import LabelEditor from '../Form/editor/Widget/LabelEditor.vue';
    export default {
        name: 'AddressFields',
        components: {
            popover,
            Icon,
            draggable,
            LabelEditor,
        },
        props: [ 'fields', 'field_options' ],
        data() {
            return {
                data_fields: [],
                plain_content: '',
                countries: {},
                cursorPos: 0,
                editorShortcodes: [],
                filterMode: {
                    all: 'All',
                    hide: 'Hide',
                    show: 'Show Only',
                    priority: 'Priority'
                },
                isDropdownOpen: false,
                searchQuery: '',
                selectedCountries: []
            }
        },
        
        created() {
            this.data_fields.push(Object.values(this.field_options))
            this.countries = window.wpPayFormsAdmin.countries
            this.editorShortcodes =  Object.values(window.wpPayFormsAdmin.value_placeholders)
            if (this.field_options.country && !this.field_options.country.filterMode) {
                this.$set(this.field_options.country, 'filterMode', 'all');
            }
            if (this.field_options.country && this.field_options.country.countries) {
                this.selectedCountries = this.field_options.country.countries
            }
        },
        watch: {
            field_options: {
                handler(newVal) {
                    this.data_fields = [Object.values(newVal)]
                },
                deep: true
            },
            selectedCountries: {
                handler(newVal) {
                    this.$set(this.field_options.country, 'countries', newVal);
                },
                deep: true
            }
        },

        computed: {
            filteredCountries() {
            if (!this.searchQuery) {
                return this.countries
            }

            const query = this.searchQuery.toLowerCase()
            const filtered = {}
            
            Object.keys(this.countries).forEach(code => {
                if (this.countries[code].toLowerCase().includes(query)) {
                filtered[code] = this.countries[code]
                }
            })

            return filtered
            },
            showPriorityLabel() {
            return this.field_options.country && this.field_options.country.filterMode === 'priority'
            }
        },

        methods: {
            addMoreField() {
                // Generate a unique field ID
                // const fieldId = 'custom_field_' + Date.now();
                const fieldId = 'address_field_' + (Object.keys(this.field_options).length + 1);
                
                // Create new field structure
                const newField = {
                    id: fieldId,
                    label: 'Custom Field',
                    default_value: '',
                    visibility: 'yes',
                    required: 'no',
                    placeholder: '',
                    type: 'text'
                };
                
                // Add to field_options
                this.$set(this.field_options, fieldId, newField);
                
                // Add to fields mapping
                this.$set(this.fields, fieldId, 'Custom Field');
                
                // Update data_fields array
                this.data_fields[0].push(newField);
                
                // Emit event to parent component
                this.$emit('update:field_options', this.field_options);
                this.$emit('field-added', {
                    fieldId: fieldId,
                    field: newField
                });
                
                // Show success message
                this.$message({
                    message: 'New address field added successfully',
                    type: 'success',
                    duration: 2000
                });
            },
            isDefaultAddressField(id) {
                const defaultFields = [
                'address_line_1',
                'address_line_2',
                'state',
                'city',
                'country',
                'zip_code'
                ];
                return defaultFields.includes(id);
            },
            deleteField( fieldId ) {
                this.data_fields[0] = this.data_fields[0].filter(field => field.id !== fieldId);
                // Remove field from field_options
                delete this.field_options[fieldId]
                // Remove field from fields mapping
                delete this.fields[fieldId]

                // Emit event to parent component
                this.$emit('update:field_options', this.field_options);
                this.$emit('update:fields', this.fields);
                this.$emit('field-deleted', {
                    deletedField: fieldId,
                    remainingFields: this.data_fields[0]
                });
                this.$message({
                    message: 'Address field deleted successfully',
                    type: 'success',
                    duration: 2000
                });
            },
            disableStyle(shortcodes) {
                if (shortcodes?.length === 0 && window.wpPayFormsAdmin.has_pro == '') {
                    return 'pointer-events: none; opacity: 0.5;'
                }
            },
            handleCommand(command) {
                if (this.hasWpEditor) {
                    tinymce.activeEditor.insertContent(command);
                } else {
                    var part1 = this.plain_content.slice(0, this.cursorPos);
                    var part2 = this.plain_content.slice(this.cursorPos, this.plain_content.length);
                    this.plain_content = part1 + command + part2;
                    this.cursorPos += command.length;
                }
            },
            onDragEnd(evt) {
                const { oldIndex, newIndex } = evt;
                if (oldIndex !== newIndex) {
                    const reorderedFields = {};
                    this.data_fields[0].forEach((field) => {
                        reorderedFields[field.id] = field;
                    });
                    this.$emit("update:field_options", reorderedFields);
                    this.$message({
                        message: "Field order updated successfully",
                        type: "success",
                        duration: 1500,
                    });
                }
            },
            handleFilterModeChange(mode) {
                this.field_options['country']['filterMode'] = mode;
            },
            toggleDropdown() {
                this.isDropdownOpen = !this.isDropdownOpen;
                if (this.isDropdownOpen) {
                    this.$nextTick(() => {
                        document.addEventListener('click', this.handleClickOutside);
                    });
                } else {
                    document.removeEventListener('click', this.handleClickOutside);
                }
            },

            closeDropdown() {
                this.isDropdownOpen = false;
                this.searchQuery = '';
                document.removeEventListener('click', this.handleClickOutside);
            },

            isSelected(code) {
                return this.selectedCountries.includes(code)
            },

            // toggleCountry(code) {
            //   const index = this.selectedCountries.indexOf(code)
            //   if (index > -1) {
            //     this.selectedCountries.splice(index, 1)
            //   } else {
            //     this.selectedCountries.push(code)
            //   }
            // },

            removeCountry(code) {
                const index = this.selectedCountries.indexOf(code)
                if (index > -1) {
                    this.selectedCountries.splice(index, 1)
                }
            },

            getCountryName(code) {
                return this.countries[code] || code
            },

            handleClickOutside(event) {
                const popover = this.$refs.countryPopover?.$el;
                const trigger = this.$refs.countryTrigger;
                
                if (popover && trigger && 
                    !popover.contains(event.target) && 
                    !trigger.contains(event.target)) {
                    this.closeDropdown();
                }
            },
            getTooltipContent(index) {
                switch (index) {
                    case 'all':
                        return 'Show all countries'
                    case 'hide':
                        return 'Hide selected countries'
                    case 'show':
                        return 'Show only selected countries'
                    case 'priority':
                        return 'Show priority countries first'
                }
            }
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside)
        },
        
        beforeDestroy() {
            document.removeEventListener('click', this.handleClickOutside)
        }
    }
</script>
<style scoped>
.address-table {
    width: 100%;
    border-collapse: collapse;
}

.address-table th,
.address-table td {
    border: 1px solid #EAECF0;
    padding: 10px;
}

.drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #c0c4cc;
    transition: color 0.3s ease;
}

.drag-handle:hover {
    color: #409eff;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.address-table tbody {
    user-select: none;
}

.el-button.is-disabled {
    opacity: 0.5;
}
.country-selector {
  width: 100%;
  margin-bottom: 20px;
}

.selector-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.countries-container {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.countries-container:hover {
  border-color: #cbd5e1;
}

.countries-container.focused {
  border-color: #f97316;
  background: white;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 32px;
}

/* Override Element UI Tag Styles */
.country-tag {
  background: white !important;
  border: 1px solid #e5e7eb !important;
  color: #374151 !important;
  padding: 6px 12px !important;
  height: auto !important;
  line-height: normal !important;
  animation: slideIn 0.3s ease-out;
  transition: all 0.2s;
}

.country-tag:hover {
  border-color: #f97316 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.country-tag .el-tag__close {
  background-color: #f3f4f6;
  color: #6b7280;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  line-height: 16px;
  transition: all 0.2s;
}

.country-tag .el-tag__close:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-trigger:hover {
  border-color: #cbd5e1;
}

.placeholder {
  color: #9ca3af;
  font-size: 14px;
}

.arrow-icon {
  color: #9ca3af;
  font-size: 12px;
  transition: transform 0.3s;
}

.countries-container.focused .arrow-icon {
  transform: rotate(180deg);
}

.dropdown-content {
  padding: 12px;
}

/* Override Element UI Input Styles */
.search-input {
  margin-bottom: 12px;
}

.search-input >>> .el-input__inner {
  border-color: #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s;
}

.search-input >>> .el-input__inner:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.countries-list {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 4px;
}

.countries-list::-webkit-scrollbar {
  width: 6px;
}

.countries-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.countries-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.countries-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.country-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.country-item:hover {
  background: #f9fafb;
}

.country-item.selected {
  background: #fef3f2;
}

/* Override Element UI Checkbox Styles */
.country-item >>> .el-checkbox {
  width: 100%;
  margin: 0;
}

.country-item >>> .el-checkbox__input {
  margin-right: 10px;
}

.country-item >>> .el-checkbox__inner {
  border-color: #e5e7eb;
  border-radius: 3px;
  width: 18px;
  height: 18px;
}

.country-item.selected >>> .el-checkbox__inner {
  background-color: #f97316;
  border-color: #f97316;
}

.country-item >>> .el-checkbox__inner::after {
  border-color: white;
  border-width: 2px;
  height: 9px;
  left: 5px;
  top: 2px !important;
  width: 4px;
}

.country-item >>> .el-checkbox__label {
  padding-left: 0;
  font-size: 14px;
  color: #374151;
}

.country-item.selected >>> .el-checkbox__label {
  color: #f97316;
  font-weight: 500;
}

.country-name {
  font-size: 14px;
}

/* Override Element UI Priority Input */
.priority-input {
  margin-top: 16px;
  margin-left: 210px;
}

.priority-input >>> .el-input__inner {
  border-color: #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
  width: 79%;
}

.priority-input >>> .el-input__inner:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}
.close-dropdown {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px 10px 0;
  cursor: pointer;
}

.close-icon {
  font-size: 18px;
  color: #9ca3af;
  transition: all 0.25s ease;
}

.close-icon:hover {
  color: #f97316;
  transform: rotate(90deg);
}
.country-selector-popover {
  padding: 0 !important;
  border-radius: 10px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e5e7eb !important;
}
</style>

<style>
/* Global styles for popover */
.country-selector-popover {
  padding: 0 !important;
  border-radius: 10px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e5e7eb !important;
}

.country-selector-popover .popper__arrow {
  display: none;
}
</style>
