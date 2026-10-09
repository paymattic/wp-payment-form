<template>
    <div v-loading="loading" class="add_on_modules" >
        <div style="margin-bottom: 0px" class="modules_header">
            <h3 class="module_title">
                Paymattic PDF Modules 
            </h3>
            <p>
                Generate PDF from your form submissions. You can create PDF templates and download / send via email too.
            </p>
        </div>
        <div style="padding: 45px 20px;display: block; background: white; border-radius: 10px" class="modules_body">
            
            <div v-if="!loading && !is_installed" style="text-align: center" class="install_wrapper">
                <h2>PDF Module is not installed yet. Please install now (it's free)</h2>
                <a class="button-primary" :href="install_url">Install Fluent Forms PDF Addon</a>
            </div>
            <div > 
                <div v-if="downloadableFiles.length > 0" style="text-align: center" class="font_downloader_wrapper">
                    <h3>Fonts are required for PDF Generation</h3>
                    <p>This module requires to download fonts for PDF generation. Please click on the bellow button and it will download the required font files. This is one time job</p>
                    <button  id="wpf_download_fonts" class="button-primary" @click="initDownloadFonts">Install Fonts</button>
                    <div class="wpf_download_loading"></div>
                    <div style="text-align: left; line-height: 130%; display: none;max-width: 500px; border: 2px solid gray; margin: 20px auto;background: white;padding: 20px; max-height: 200px;overflow: scroll;" class="wpf_download_logs"></div>
                </div>
                <div v-if="!rendering && downloadableFiles.length == 0" class="wpf_pdf_system_status">
                    <h3>Fluent PDF Module is now active <span v-if="!statuses.status" style="color: red;">But Few Server Extensions are missing</span></h3>
                    <ul>
                            <li v-for="(status, index) in statuses.extensions" :key="index" style="display: flex; align-items: center;"> 
                            <span v-if="status" class="dashicons dashicons-yes"></span>
                            <span v-else class="dashicons dashicons-no-alt"></span>
                            <p> {{status.label}} </p>
                        </li> 
                    </ul>
                    
                    <p v-if="statuses.status">All Looks good! You can now use Fluent PDF Addon. <a :href="globalSettingsUrl">Clicke Here</a> to check your global PDF feed settings</p>
                </div>
            </div>
            <!-- content -->
        </div>
    </div>
</template>

<script>


export default {
    name: 'pdf_promo',
    props: [],
    data() {
        return {
            is_installed: false,
			install_url: '',
			loading: true,
			downloadableFiles: [],
			statuses: {},
            globalSettingsUrl: '',
            rendering: true,
            buttonText: 'Install Fonts',
            disabled: false
        }
    },
    methods: {
        getPdfInstallInfo() {
            this.loading = true;
			this.$get('wppayform-pdf/get_pdf_info')
				.then(response => {
					this.is_installed = response.is_installed;
					this.install_url = response.install_url
				})
				.fail((error) => {
                    this.$notify.error({
                        title: 'Error!',
                        message: error.message,
                        position: 'bottom-right',
                        offset: 30
                    })
				})
				.always(() => {
					this.loading = false;
				});
		},
		renderGlobalPdf() {
			this.loading = true;
			this.$get('wppayform-pdf/render_global', {})
				.then(response => {
					this.downloadableFiles = response.downloadableFiles;
					this.statuses = response.statuses;
                    this.globalSettingsUrl = response.globalSettingsUrl;
                    this.rendering = false;
					console.log('response: ' , this.statuses)
				})
				.fail((error) => {
					this.$notify.error({
                        title: 'Error!',
                        message: error.message,
                        position: 'bottom-right',
                        offset: 30
                    })
				})
				.always(() => {
					this.loading = false;
				});
        },
        loadFonts() {
            console.log('loading');
            this.$post('wppayform-pdf/downloadFonts', {})
                .then(response => {
                    if(response.data.downloaded_files && response.data.downloaded_files.length) {
                       jQuery(document).ready(function ($) {
                            $('.wpf_download_logs').prepend(response.data.downloaded_files.join('<br />')).show();  
                       });

                        this.loadFonts();
                        
                    } else {
                        // All Done
                        window.location.reload();
                    }
                })
                .fail(error => {
                    window.location.reload();
                });
        },
        initDownloadFonts(e) {
            e.preventDefault();
            jQuery(document).ready(function ($) {
                  $('#wpf_download_fonts').text('Downloading...').attr('disabled', true);
                  $('.wpf_download_loading').html('Please do not close this window when downloading the fonts');    
            });
            this.loadFonts();            
        }
    },
    mounted() {
        this.getPdfInstallInfo();
        this.renderGlobalPdf();
    }
}
</script>
