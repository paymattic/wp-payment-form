<template>
   <div class="wpf_community_wrapper">
      <div class="wpf_community">
         <div class="wpf_community__content">
          <div class="wpf_community__content__section" v-if="userCommunties?.length > 0 || userCourses?.length > 0">
               <div
                    v-loading="!fectechdUserSpaces"
                    :element-loading-text="$t('Loading...')"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.1)"
                    class="wpf_community__content__section">
                    <div v-if="userCommunties?.length > 0">
                      <div class="section_title">{{ $t('My Spaces') }}</div>
                      <div class="wpf_community__content__section__content">
                        <div v-for="space in userCommunties" :key="space.id" @click="moveToPermalink(space.permalink)">
                            <div class="wpf_community__content__section__content__space card">
                              <div class="card_avatar">
                                <img :src="space.cover_photo" alt="space cover image" />
                              </div>
                              <div class="card_info"> 
                                <div class="card_title">{{ space.title }}</div>
                                <div class="card_details">
                                    <div v-if="space.privacy == 'private'" class="details_item">
                                      <Icon icon="wpf-lock-icon" class="details_icon"/>
                                      <span class="privacy">{{ $t('Private') }}</span>
                                    </div>
                                    <div v-else class="details_item">
                                      <Icon icon="wpf-glob-icon" class="details_icon"/>
                                      <span class="privacy">{{ $t('Public') }}</span>
                                    </div> 
                                    <div class="details_item" v-if="space.members_count > 0">
                                      <!-- number of members with icon -->
                                      <Icon icon="wpf-group-icon" class="details_icon"/>
                                      <span>{{ memebersCount(space.members_count) }}</span>
                                    </div>
                                  </div>
                                  <div class="card_description">{{ space.description }}</div>
                                  <div class="card_action">
                                    <button class="button">
                                      <a :href="space.permalink" target="_blank">{{ $t('View Space') }}</a>
                                    </button>
                                </div>
                              </div>
                            </div>       
                        </div>
                      </div>
                  
                    </div>
                    <div v-if="userCourses?.length > 0">
                      <div class="section_title">{{ $t('My Courses') }}</div>
                      <div class="wpf_community__content__section__content">
                        <div v-for="course in userCourses" :key="course.id" @click="moveToPermalink(course.permalink)">
                            <div class="wpf_community__content__section__content__space card">
                              <div class="card_avatar">
                                <img :src="course.cover_photo" alt="course cover image" />
                              </div>
                              <div class="card_info"> 
                                <div class="card_title">{{ course.title }}</div>
                                <div class="card_details"> 
                                  <div class="inline_details"> 
                                    <span>{{ sectionsCount(course.sectionsCount) }}</span>
                                    <span class="fcom_inline_separator"></span>
                                    <span>{{ lessionsCount(course.lessonsCount) }}</span>
                                  </div>
                                  <div class="inline_details"> 
                                    <!-- number of students with icon -->
                                    <Icon icon="wpf-group-icon" class="details_icon"/>
                                    <span>{{ studentsCount(course.studentsCount) }}</span>
                                  </div>
                                </div>
                                <div class="card_description">{{ course.description }}</div>
                                <div class="card_action">
                                  <button class="button">
                                    <a :href="course.permalink" target="_blank">{{ course.progress }}% {{ $t('Completed') }}</a>
                                  </button>
                                </div>
                              </div>
                            </div>       
                        </div>
                      </div>
                    </div>
               </div>
          </div>

            <div v-loading="!fetchedAllSpaces"
                :element-loading-text="$t('Loading...')"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.1)"
                class="wpf_community__content__section" style="display: flex; flex-direction: column; gap: 20px;">
                <template v-if="recommendedCommunities?.length > 0 || recommendedCourses?.length > 0" class="wpf_community__content__sub__section">
                  <div v-if="recommendedCourses.length > 0">
                      <div class="section_title">{{ $t('Available courses') }}</div>
                      <div class="wpf_community__content__section__content">
                        <div v-for="course in recommendedCourses" :key="course.id" @click="moveToPermalink(course.permalink)">
                          <div class="wpf_community__content__section__content__space card">
                              <div class="card_avatar">
                                <img :src="course.cover_photo" alt="course cover image" />
                              </div>
                              <div class="card_info">
                                <div class="card_title">{{ course.title }}</div>
                                <div class="card_details"> 
                                <div class="inline_details"> 
                                  <span>{{ sectionsCount(course.sectionsCount) }}</span>
                                  <span class="fcom_inline_separator"></span>
                                  <span>{{ lessionsCount(course.lessonsCount) }}</span>
                                </div>
                                <div class="inline_details"> 
                                  <!-- number of students with icon -->
                                  <Icon icon="wpf-group-icon" class="details_icon"/>
                                  <span>{{ studentsCount(course.studentsCount) }}</span>
                                </div>
                              </div>
                                <div class="card_description">{{ course.description }}</div>
                                <div class="card_action">
                                  <button class="button">
                                    <a :href="course.permalink" target="_blank">{{ $t('Enroll in course') }}</a>
                                  </button>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  <div v-if="recommendedCommunities?.length > 0">
                      <div class="section_title">{{ $t('Other Spaces') }}</div>
                      <div class="wpf_community__content__section__content">
                        <div v-for="community in recommendedCommunities" :key="community.id">
                          <div class="wpf_community__content__section__content__space card" @click="moveToPermalink(community.permalink)">
                              <div class="card_avatar">
                                <img :src="community.cover_photo" alt="space cover image" />
                              </div>
                              <div class="card_info">
                                <div class="card_title">{{ community.title }}</div>
                                <div class="card_details">     
                                    <div v-if="community.privacy == 'private'" class="details_item">
                                      <Icon icon="wpf-lock-icon" class="details_icon"/>
                                      <span class="privacy">{{ $t('Private') }}</span>
                                    </div>
                                    <div v-else class="details_item">
                                      <Icon icon="wpf-glob-icon" class="details_icon"/>
                                      <span class="privacy">{{ $t('Public') }}</span>
                                    </div> 
                                    <div class="details_item" v-if="community.members_count > 0">
                                      <!-- number of members with icon -->
                                      <Icon icon="wpf-group-icon" class="details_icon"/>
                                      <span>{{ memebersCount(community.members_count) }}</span>
                                    </div>
                                </div>
                                <div class="card_description">{{ community.description }}</div>
                                <div class="card_action">
                                  <button class="button">
                                    <a :href="community.permalink" target="_blank">{{ $t('Join Space') }}</a>
                                  </button>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </template>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
import Icon from '../../admin/Components/Icons/Index.vue'
export default {
  name: 'Community',
  components: {
    Icon
  },
  data() {
    return {
      recommendedSpaces: [],
      recommendedCommunities: [],
      recommendedCourses: [],
      userCommunties: [],
      userCourses: [],
      fetchedAllSpaces: false,
      fectechdUserSpaces: false,
      ajax_url: window.wpPayFormsDashboard.ajaxurl,
      nonce: window.wpPayFormsDashboard.nonce,
    }
  },
  methods: {
    getRecommendedSpaces() {
        const _that = this;
        jQuery.ajax({
            method: 'GET',
            url: this.ajax_url,
            dataType: "json",
            data: {
                action: "get_fluent_community_spaces",
                route: "get_recommended_spaces",
                nonce: this.nonce,
            },
            success(res) {
                _that.fetchedAllSpaces = true;
                _that.recommendedSpaces = res?.data?.spaces;
                _that.recommendedCommunities = res?.data?.spaces.community;
                _that.recommendedCourses = res?.data?.spaces?.course;
            },
            error(err) {
               _that.fetchedAllSpaces = true;
               _that.data = [];
            }
        });

      // Rest.$get('fluent-community/spaces')
      //   .then(response => {
      //     this.communitySpaces = response.data
      //   })
      //   .catch(error => {
          
      //   })
    },
    getUserSpaces() {
        const _that = this;
        jQuery.ajax({
            method: 'GET',
            url: this.ajax_url,
            dataType: "json",
            data: {
                action: "get_fluent_community_spaces",
                route: "get_user_spaces",
                nonce: this.nonce,
            },
            success(res) {
                _that.fectechdUserSpaces = true;
                _that.userCommunties = res?.data?.spaces?.community;
                _that.userCourses = res?.data?.spaces?.course;
            },
            error(err) {
                _that.fectechdUserSpaces = true;
              _that.data = [];
            }
        });
    },
    sectionsCount(sections) {
      return sections > 1 ? `${sections} ${this.$t('Sections')}` : `${sections} ${this.$t('Section')}`
    },
    lessionsCount(lessons) {
      return lessons > 1 ? `${lessons} ${this.$t('Lessons')}` : `${lessons} ${this.$t('Lesson')}`
    },
    memebersCount(members) {
      return members > 1 ? `${members} ${this.$t('Members')}` : `${members} ${this.$t('Member')}`
    },
    studentsCount(students) {
      return students > 1 ? `${students} ${this.$t('Students')}` : `${students} ${this.$t('Student')}`
    },
    moveToPermalink(permalink) {
      window.open(permalink, '_blank');
    }
  },
  mounted() {
    this.getUserSpaces()
    this.getRecommendedSpaces()
  }
}
</script>

<style scoped lang="scss">
  .wpf_community_wrapper{
    font-family: 'Nato Sans', sans-serif;
  }
  .wpf_community__content{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .wpf_community__content__section{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .wpf_community__content__sub__section{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .wpf_community__content__section__content{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .section_title{
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .card {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    height: 100%;
  }

  .card:hover{
    box-shadow: 0 8px 30px rgba(27, 37, 51, 0.2);
  }

  .card_avatar {
    cursor: pointer;
    width: 100%;
    height: 177px;
    overflow: hidden;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .card_avatar img {
    width: 100%;
    height: 100%;
    object-fit: card_cover;
    aspect-ratio: 1.91 / 1;
  }

  .card_info {
    display: flex;
    flex-direction: column;
    border: 1px solid #e9e9e9;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background: #fff;
    flex: 1;
    gap: 12px;
    padding: 12px;
  }

  .card_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .card_description {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.5;
    max-height: 4.5em; /* 3 lines × 1.5 line-height */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }

  .details {
    margin-right: 5px;
  }

  .details_icon{
    display: flex;
  }
  .details_item{
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #4b5563;
  }

  .card_action{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;
  }

  .button {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    width: 100%;
    padding: 8px;
    background: #e3f2ed;
  }

  .card_details{
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .inline_details{
    display: flex;
    align-items: center;
    color: #4b5563;
    gap: 5px;
    font-size: 14px;
  }

  .fcom_inline_separator{
    background: #4b5563;
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .button a{
    text-decoration: none;
    color: #000;
  }
</style>
