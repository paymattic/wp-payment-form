<template>
    <div class="wpf-migrator">

        <!-- ================================================================
             STEP INDICATOR (custom, three numbered circles + connectors)
        ================================================================ -->
        <div class="wpf-migrator__stepper">
            <div
                v-for="(step, idx) in stepperItems"
                :key="step.key"
                class="wpf-migrator__stepper-item"
                :class="'wpf-migrator__stepper-item--' + stepState(idx)"
            >
                <div class="wpf-migrator__stepper-node">
                    <span class="wpf-migrator__stepper-circle">
                        <svg
                            v-if="stepState(idx) === 'done'"
                            width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                        ><polyline points="20 6 9 17 4 12"/></svg>
                        <span v-else>{{ idx + 1 }}</span>
                    </span>
                </div>
                <span class="wpf-migrator__stepper-label">{{ step.label }}</span>
                <span
                    v-if="idx < stepperItems.length - 1"
                    class="wpf-migrator__stepper-connector"
                    :class="{ 'wpf-migrator__stepper-connector--done': stepState(idx) === 'done' }"
                ></span>
            </div>
        </div>

        <!-- ================================================================
             SCREEN: PREFLIGHT
        ================================================================ -->
        <div v-if="screen === 'preflight'" class="wpf-migrator__screen">

            <!-- Welcome state -->
            <div v-if="!preflight && !isRunningPreflight" class="wpf-migrator__panel wpf-migrator__welcome">
                <div class="wpf-migrator__welcome-bridge">
                    <div class="wpf-migrator__brand-mark wpf-migrator__brand-mark--give">
                        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 157.2 157.2">
                            <circle fill="#66bb6a" cx="78.6" cy="78.6" r="78.6"/>
                            <path fill="#fff" d="M89.8 84.2c.3.7 1 1.3 1 1.3 13.9 1.7 33.6-.2 48.6-2.2-8.6 18.5-24 30.8-38.1 30.8-26.5 0-46.9-32.1-46.9-32.1 8.2-7.2 21.7-30.8 41.2-30.8s28 10.7 28 10.7l2.2-3.5s-9.1-31.9-34.9-31.9-53.2 42.3-69.2 52c0 0 22 52.2 70.2 52.2 40.4 0 50.6-38.6 52.5-48.2 5.4-.8 9.9-1.6 12.8-2.1 1-2.2 2.1-6.1 1.3-11.3-16.1 6.2-40.5 13.2-69.1 13.2-.1 0 0 1 .4 1.9z"/>
                        </svg>
                    </div>
                    <div class="wpf-migrator__welcome-arrow">
                        <svg width="32" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 8H38" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M30 2L38 8L30 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="wpf-migrator__brand-mark wpf-migrator__brand-mark--paymattic">
                        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 58 59" fill="none">
                            <path d="M0 6.3C0 3.09675 2.59675 0.5 5.8 0.5H52.2C55.4033 0.5 58 3.09675 58 6.3V52.7C58 55.9033 55.4033 58.5 52.2 58.5H5.8C2.59675 58.5 0 55.9033 0 52.7V6.3Z" fill="#FF6A00"/>
                            <path d="M41.2322 11.2262C40.9114 10.487 40.0499 10.054 39.2096 10.3308L37.8537 10.7763C37.8437 10.7794 37.8329 10.783 37.823 10.7861L19.0568 16.9582C18.949 16.9938 18.843 17.0348 18.7415 17.0811C17.4848 17.7001 17.5624 19.5857 18.9715 20.0494L18.9724 20.0503L26.8296 22.6342L34.4878 20.1202C35.053 19.9346 35.6358 20.3498 35.6358 20.9372V26.2505C35.6358 26.9919 35.1545 27.6501 34.4413 27.8842L31.545 28.8348V37.0665L39.1252 34.5739C40.4613 34.1338 41.3625 32.9001 41.3625 31.5107V11.8622C41.3625 11.6339 41.3156 11.4198 41.2317 11.2262H41.2322Z" fill="white" fill-opacity="0.7"/>
                            <path d="M29.3095 23.4485L18.9737 20.0498L18.9728 20.0489C17.5632 19.5852 17.4861 17.6996 18.7428 17.0806C17.5817 17.5981 16.8203 18.7432 16.8203 20.0209V41.2293C16.8203 42.6196 17.7215 43.8532 19.0576 44.2925L29.3934 47.6912C30.4525 48.0401 31.5468 47.2617 31.5468 46.1598V26.5117C31.5468 25.1223 30.6455 23.8878 29.3095 23.4485Z" fill="white"/>
                        </svg>
                    </div>
                </div>
                <h2 class="wpf-migrator__welcome-title">Migrate from GiveWP to Paymattic</h2>
                <p class="wpf-migrator__welcome-sub">
                    Move your donation forms, donors and payment history across in a few guided
                    steps. The pre-flight check scans your environment and flags any compatibility
                    notes before a single row is written.
                </p>
                <div class="wpf-migrator__welcome-warning">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span><strong>Back up your database first.</strong> This tool writes directly to your DB.</span>
                </div>
                <el-tooltip
                    placement="top"
                    effect="dark"
                    :disabled="isGiveWpActive"
                    content="GiveWP plugin is not installed or active. Install and activate GiveWP before running the pre-flight check."
                    popper-class="wpf-migrator__tooltip"
                >
                    <span class="wpf-migrator__btn-wrap">
                        <button
                            class="wpf-migrator__btn wpf-migrator__btn--primary wpf-migrator__btn--block"
                            :disabled="isRunningPreflight || !isGiveWpActive"
                            @click="runPreflight"
                        >
                            Run A Pre-flight Check
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </span>
                </el-tooltip>
            </div>

            <!-- Running state -->
            <div v-if="isRunningPreflight" class="wpf-migrator__panel wpf-migrator__loading">
                <span class="wpf-migrator__spinner"></span>
                <span>Running pre-flight checks…</span>
            </div>

            <!-- Results -->
            <template v-if="preflight && !isRunningPreflight">
                <div class="wpf-migrator__title-row">
                    <h2 class="wpf-migrator__page-title">Pre-flight Results</h2>
                    <button class="wpf-migrator__link" @click="runPreflight">Run again</button>
                </div>

                <div class="wpf-migrator__panel">

                    <!-- System status -->
                    <section class="wpf-migrator__section">
                        <h3 class="wpf-migrator__section-title">System Status</h3>
                        <ul class="wpf-migrator__checks">
                            <li class="wpf-migrator__check">
                                <span class="wpf-migrator__check-icon" :class="iconClass(preflight.givewp_active ? 'ok' : 'fail')">
                                    <component :is="iconComponent(preflight.givewp_active ? 'ok' : 'fail')" />
                                </span>
                                <span class="wpf-migrator__check-text">
                                    GiveWP {{ preflight.givewp_active ? 'detected' : 'not detected — GiveWP must be active to migrate' }}
                                </span>
                            </li>
                            <li class="wpf-migrator__check">
                                <span class="wpf-migrator__check-icon" :class="iconClass(preflight.paymattic_active ? 'ok' : 'fail')">
                                    <component :is="iconComponent(preflight.paymattic_active ? 'ok' : 'fail')" />
                                </span>
                                <span class="wpf-migrator__check-text">
                                    Paymattic {{ preflight.paymattic_active ? 'active' : 'not active' }}
                                </span>
                            </li>
                            <li class="wpf-migrator__check">
                                <span class="wpf-migrator__check-icon" :class="iconClass(preflight.is_pro ? 'ok' : 'warn')">
                                    <component :is="iconComponent(preflight.is_pro ? 'ok' : 'warn')" />
                                </span>
                                <span class="wpf-migrator__check-text">
                                    Paymattic Pro {{ preflight.is_pro ? 'active' : 'not active (see warnings below)' }}
                                </span>
                            </li>
                            <li class="wpf-migrator__check">
                                <span class="wpf-migrator__check-icon" :class="iconClass(preflight.memory_ok === false ? 'warn' : 'info')">
                                    <component :is="iconComponent(preflight.memory_ok === false ? 'warn' : 'info')" />
                                </span>
                                <span class="wpf-migrator__check-text wpf-migrator__check-text--muted">
                                    PHP {{ preflight.php_version }}  |  Memory limit: {{ preflight.memory_limit }}<span v-if="preflight.memory_ok === false"> — may be too low for large datasets</span>
                                </span>
                            </li>
                        </ul>
                    </section>

                    <!-- Migration preview -->
                    <section class="wpf-migrator__section">
                        <h3 class="wpf-migrator__section-title">Migration Preview</h3>
                        <div class="wpf-migrator__tiles">
                            <div class="wpf-migrator__tile">
                                <span class="wpf-migrator__tile-number">{{ preflight.give_donation_count | number }}</span>
                                <span class="wpf-migrator__tile-label">Donations</span>
                            </div>
                            <div class="wpf-migrator__tile">
                                <span class="wpf-migrator__tile-number">{{ preflight.give_form_count | number }}</span>
                                <span class="wpf-migrator__tile-label">Forms</span>
                            </div>
                            <div
                                v-if="preflight.recurring_addon && preflight.give_subscription_count > 0"
                                class="wpf-migrator__tile"
                            >
                                <span class="wpf-migrator__tile-number">{{ preflight.give_subscription_count | number }}</span>
                                <span class="wpf-migrator__tile-label">Subscriptions</span>
                            </div>
                        </div>
                    </section>

                    <!-- Payment Methods Needing Alternatives -->
                    <section
                        v-if="missingFeaturesGrouped.length"
                        class="wpf-migrator__section"
                    >
                        <div class="wpf-migrator__missing-title-row">
                            <h3 class="wpf-migrator__section-title">Payment Methods Needing Alternatives</h3>
                        </div>
                        <p class="wpf-migrator__section-intro" style="margin-top: 6px;">
                            Map these GiveWP methods to a Paymattic-supported gateway to keep collecting donations.
                        </p>

                        <div
                            v-for="(group, gIdx) in missingFeaturesGrouped"
                            :key="group.category + '_' + gIdx"
                            class="wpf-migrator__missing-group"
                        >
                            <h4
                                v-if="missingFeaturesGrouped.length > 1"
                                class="wpf-migrator__missing-category"
                            >{{ group.category }}</h4>
                            <div class="wpf-migrator__missing-chips">
                                <span
                                    v-for="(item, idx) in group.items"
                                    :key="item.feature + '_' + idx"
                                    class="wpf-migrator__missing-chip"
                                >{{ item.feature }}</span>
                            </div>
                        </div>

                        <p class="wpf-migrator__missing-footer">
                            See Paymattic
                            <a
                                href="admin.php?page=wppayform.php#/gateways/stripe"
                                target="_blank"
                                rel="noopener"
                            >payment methods</a>.
                        </p>
                    </section>

                    <!-- Migration options -->
                    <section class="wpf-migrator__section">
                        <h3 class="wpf-migrator__section-title">Migration Options</h3>

                        <label v-if="preflight.gift_aid_addon" class="wpf-migrator__option wpf-migrator__option--required">
                            <input type="checkbox" v-model="giftAidAcknowledged" />
                            <span class="wpf-migrator__option-box"></span>
                            <span class="wpf-migrator__option-text">
                                <span class="wpf-migrator__option-title">Gift Aid declarations exported</span>
                                <span class="wpf-migrator__option-sub">
                                    I have already exported the Gift Aid declarations CSV from GiveWP
                                    (Tools → Export → Gift Aid Donations) and understand this migration
                                    cannot replace HMRC-format reporting.
                                </span>
                            </span>
                        </label>

                        <label class="wpf-migrator__option">
                            <input type="checkbox" v-model="includeTestMode" />
                            <span class="wpf-migrator__option-box"></span>
                            <span class="wpf-migrator__option-text">
                                <span class="wpf-migrator__option-title">Include test-mode donations</span>
                                <span class="wpf-migrator__option-sub">GiveWP donations made in test/sandbox mode</span>
                            </span>
                        </label>

                        <!-- <label class="wpf-migrator__option">
                            <input type="checkbox" v-model="isDryRun" />
                            <span class="wpf-migrator__option-box"></span>
                            <span class="wpf-migrator__option-text">
                                <span class="wpf-migrator__option-title">Dry run (preview only)</span>
                                <span class="wpf-migrator__option-sub">Count records without writing to the database</span>
                            </span>
                        </label> -->
                    </section>

                    <!-- Warnings -->
                    <section
                        v-if="preflight.warnings && preflight.warnings.length"
                        class="wpf-migrator__section wpf-migrator__section--inset"
                    >
                        <div
                            v-for="(warning, idx) in preflight.warnings"
                            :key="warning + '_' + idx"
                            class="wpf-migrator__alert wpf-migrator__alert--warn"
                        >
                            <span class="wpf-migrator__check-icon wpf-migrator__check-icon--warn"><icon-warn/></span>
                            <span>{{ warning }}</span>
                        </div>
                    </section>

                    <!-- Errors from previous run -->
                    <section v-if="errors.length" class="wpf-migrator__section wpf-migrator__section--inset">
                        <div class="wpf-migrator__alert wpf-migrator__alert--error">
                            <span class="wpf-migrator__check-icon wpf-migrator__check-icon--fail"><icon-fail/></span>
                            <span>Errors from previous session</span>
                        </div>
                        <ul class="wpf-migrator__error-list">
                            <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
                        </ul>
                    </section>
                </div>

                <!-- Bottom actions -->
                <div class="wpf-migrator__footer">
                    <button class="wpf-migrator__btn wpf-migrator__btn--ghost" @click="resetWelcome">
                        Back
                    </button>
                    <button
                        class="wpf-migrator__btn wpf-migrator__btn--primary"
                        :disabled="!canStartMigration"
                        @click="startMigration"
                    >
                        {{ isDryRun ? 'Start Dry Run' : 'Start Migration' }}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>
                <p v-if="gateMessage" class="wpf-migrator__gate-hint">{{ gateMessage }}</p>
            </template>
        </div>

        <!-- ================================================================
             SCREEN: MIGRATING
        ================================================================ -->
        <div v-if="screen === 'migrating'" class="wpf-migrator__screen">
            <div class="wpf-migrator__title-row">
                <h2 class="wpf-migrator__page-title">{{ isDryRun ? 'Dry Run in Progress' : 'Migration in Progress' }}</h2>
            </div>

            <div class="wpf-migrator__panel">
                <section v-if="isDryRun" class="wpf-migrator__section wpf-migrator__section--inset">
                    <div class="wpf-migrator__alert wpf-migrator__alert--info">
                        <span class="wpf-migrator__check-icon wpf-migrator__check-icon--info"><icon-info/></span>
                        <span>Dry Run Mode: no data will be written to the database.</span>
                    </div>
                </section>

                <section class="wpf-migrator__section">
                    <h3 class="wpf-migrator__section-title">Phases</h3>
                    <ul class="wpf-migrator__phases">
                        <li
                            v-for="phase in activePhasesForRun"
                            :key="phase.key"
                            class="wpf-migrator__phase"
                            :class="{
                                'wpf-migrator__phase--done':   phase.done,
                                'wpf-migrator__phase--active': currentPhase === phase.key && !phase.done,
                            }"
                        >
                            <div class="wpf-migrator__phase-head">
                                <span class="wpf-migrator__phase-icon">
                                    <icon-ok v-if="phase.done" />
                                    <span v-else-if="currentPhase === phase.key" class="wpf-migrator__spinner wpf-migrator__spinner--small"></span>
                                    <icon-clock v-else />
                                </span>
                                <span class="wpf-migrator__phase-label">{{ phase.label }}</span>
                                <span v-if="phase.count > 0" class="wpf-migrator__phase-count">
                                    {{ phase.count | number }} processed
                                </span>
                            </div>
                            <div
                                v-if="currentPhase === phase.key || phase.done"
                                class="wpf-migrator__bar"
                            >
                                <span
                                    class="wpf-migrator__bar-fill"
                                    :class="{ 'wpf-migrator__bar-fill--done': phase.done }"
                                    :style="{ width: (phase.done ? 100 : phaseProgress(phase)) + '%' }"
                                ></span>
                            </div>
                        </li>
                    </ul>
                </section>

                <section v-if="errors.length" class="wpf-migrator__section wpf-migrator__section--inset">
                    <div
                        class="wpf-migrator__alert"
                        :class="isRunning ? 'wpf-migrator__alert--warn' : 'wpf-migrator__alert--error'"
                    >
                        <span
                            class="wpf-migrator__check-icon"
                            :class="isRunning ? 'wpf-migrator__check-icon--warn' : 'wpf-migrator__check-icon--fail'"
                        >
                            <icon-warn v-if="isRunning" />
                            <icon-fail v-else />
                        </span>
                        <span>
                            {{ isRunning
                                ? errors.length + ' error(s) encountered (migration will continue)'
                                : 'Migration stopped due to an error.'
                            }}
                        </span>
                    </div>
                    <ul class="wpf-migrator__error-list">
                        <li v-for="(err, i) in errors.slice(-5)" :key="err + '_' + i">{{ err }}</li>
                    </ul>
                </section>
            </div>

            <div v-if="!isRunning" class="wpf-migrator__footer">
                <button class="wpf-migrator__btn wpf-migrator__btn--ghost" @click="screen = 'preflight'">
                    Back to Pre-flight
                </button>
                <button
                    class="wpf-migrator__btn wpf-migrator__btn--danger"
                    :disabled="isRollingBack"
                    @click="confirmRollback"
                >
                    Rollback & Start Over
                </button>
            </div>
        </div>

        <!-- ================================================================
             SCREEN: REPORT
        ================================================================ -->
        <div v-if="screen === 'report'" class="wpf-migrator__screen">

            <div v-if="!report" class="wpf-migrator__panel wpf-migrator__loading">
                <span class="wpf-migrator__spinner"></span>
                <span>Building validation report…</span>
            </div>

            <template v-if="report">
                <div class="wpf-migrator__title-row">
                    <!-- <h2 class="wpf-migrator__page-title">Validation Report</h2> -->
                    <small v-if="report.started_at" class="wpf-migrator__title-meta">
                        Started {{ report.started_at }}<span v-if="report.completed_at"> · Completed {{ report.completed_at }}</span>
                    </small>
                </div>

                <!-- Status banner -->
                <div v-if="isDryRun" class="wpf-migrator__alert wpf-migrator__alert--info wpf-migrator__alert--block">
                    <span class="wpf-migrator__check-icon wpf-migrator__check-icon--info"><icon-info/></span>
                    <span>Dry Run complete — no data was written.</span>
                </div>
                <div v-else-if="report.status === 'completed'" class="wpf-migrator__alert wpf-migrator__alert--success wpf-migrator__alert--block wpf-migrator__alert--completed">
                    <div class="wpf-migrator__alert-content">
                        <span class="wpf-migrator__check-icon wpf-migrator__check-icon--success"><icon-ok/></span>
                        <div>
                            <strong>Migration complete</strong>
                            <p style="margin: 3px 0 0; font-size: 13px; font-weight: 400; line-height: 1.5; opacity: 0.85;">All your GiveWP data has been moved to Paymattic. Review the summary below.</p>
                        </div>
                    </div>
                    <a
                        :href="formsListUrl"
                        class="wpf-migrator__btn wpf-migrator__btn--primary wpf-migrator__btn--sm"
                        style="margin-left: auto;"
                    >
                        View All Forms
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </a>
                </div>
                <div v-else-if="report.counts.errors > 0" class="wpf-migrator__alert wpf-migrator__alert--warn wpf-migrator__alert--block">
                    <span class="wpf-migrator__check-icon wpf-migrator__check-icon--warn"><icon-warn/></span>
                    <span>{{ report.counts.errors }} error(s) recorded during migration. Review below.</span>
                </div>

                <!-- Counts -->
                <div class="wpf-migrator__panel">
                    <section class="wpf-migrator__section wpf-migrator__section--summary">
                        <div class="wpf-migrator__summary-head">
                            <h3 class="wpf-migrator__section-heading">Migration Summary</h3>
                            <button
                                type="button"
                                class="wpf-migrator__summary-action"
                                @click="downloadReport"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Download JSON
                            </button>
                        </div>
                        <ul class="wpf-migrator__report-rows">
                            <li class="wpf-migrator__report-row">
                                <span class="wpf-migrator__report-label">Forms</span>
                                <span class="wpf-migrator__report-trailing">
                                    <span class="wpf-migrator__report-value">
                                        {{ report.counts.forms_migrated | number }}
                                        <span class="wpf-migrator__report-of">/ {{ report.counts.forms_total | number }}</span>
                                    </span>
                                    <el-tooltip
                                        placement="top"
                                        effect="dark"
                                        :disabled="report.counts.forms_migrated >= report.counts.forms_total"
                                        popper-class="wpf-migrator__tooltip"
                                    >
                                        <div slot="content">
                                            <strong>{{ (report.counts.forms_total - report.counts.forms_migrated) | number }} form(s) not migrated.</strong>
                                            <div style="margin-top:6px; line-height:1.55;">Likely reasons:</div>
                                            <ul style="margin:4px 0 0; padding-left:16px; line-height:1.55;">
                                                <li>Draft, pending, or private status</li>
                                                <li>Missing title or required form data</li>
                                                <li>Errors during migration (see Errors below)</li>
                                            </ul>
                                            <div style="margin-top:6px; font-size:11.5px; opacity:0.85;">Full list with per-form skip reasons is in the Download JSON file (forms_not_migrated).</div>
                                        </div>
                                        <span class="wpf-migrator__check-icon" :class="iconClass(countStatusKey(report.counts.forms_migrated, report.counts.forms_total))">
                                            <component :is="iconComponent(countStatusKey(report.counts.forms_migrated, report.counts.forms_total))" />
                                        </span>
                                    </el-tooltip>
                                </span>
                            </li>
                            <li class="wpf-migrator__report-row">
                                <span class="wpf-migrator__report-label">Donations</span>
                                <span class="wpf-migrator__report-trailing">
                                    <span class="wpf-migrator__report-value">
                                        {{ report.counts.donations_migrated | number }}
                                        <span class="wpf-migrator__report-of">/ {{ report.counts.donations_total | number }}</span>
                                    </span>
                                    <el-tooltip
                                        placement="top"
                                        effect="dark"
                                        :disabled="report.counts.donations_migrated >= report.counts.donations_total"
                                        popper-class="wpf-migrator__tooltip"
                                    >
                                        <div slot="content">
                                            <strong>{{ (report.counts.donations_total - report.counts.donations_migrated) | number }} donation(s) not migrated.</strong>
                                            <div style="margin-top:6px; line-height:1.55;">Likely reasons:</div>
                                            <ul style="margin:4px 0 0; padding-left:16px; line-height:1.55;">
                                                <li>Test-mode donations (excluded unless opted in)</li>
                                                <li>Missing donor, form, or amount data</li>
                                                <li>Errors during migration (see Errors below)</li>
                                            </ul>
                                            <div style="margin-top:6px; font-size:11.5px; opacity:0.85;">Full list with per-donation skip reasons is in the Download JSON file (donations_not_migrated).</div>
                                        </div>
                                        <span class="wpf-migrator__check-icon" :class="iconClass(countStatusKey(report.counts.donations_migrated, report.counts.donations_total))">
                                            <component :is="iconComponent(countStatusKey(report.counts.donations_migrated, report.counts.donations_total))" />
                                        </span>
                                    </el-tooltip>
                                </span>
                            </li>
                            <li v-if="report.counts.subscriptions_total > 0" class="wpf-migrator__report-row">
                                <span class="wpf-migrator__report-label">Subscriptions</span>
                                <span class="wpf-migrator__report-trailing">
                                    <span class="wpf-migrator__report-value">
                                        {{ report.counts.subscriptions_migrated | number }}
                                        <span class="wpf-migrator__report-of">/ {{ report.counts.subscriptions_total | number }}</span>
                                    </span>
                                    <el-tooltip
                                        placement="top"
                                        effect="dark"
                                        :disabled="report.counts.subscriptions_migrated >= report.counts.subscriptions_total"
                                        popper-class="wpf-migrator__tooltip"
                                    >
                                        <div slot="content">
                                            <strong>{{ (report.counts.subscriptions_total - report.counts.subscriptions_migrated) | number }} subscription(s) not migrated.</strong>
                                            <div style="margin-top:6px; line-height:1.55;">Likely reasons:</div>
                                            <ul style="margin:4px 0 0; padding-left:16px; line-height:1.55;">
                                                <li>Pending, failing, abandoned, expired, or trashed status</li>
                                                <li>Missing amount or billing interval</li>
                                                <li>Errors during migration (see Errors below)</li>
                                            </ul>
                                            <div style="margin-top:6px; font-size:11.5px; opacity:0.85;">Full list with per-subscription skip reasons is in the Download JSON file (subscriptions_not_migrated).</div>
                                        </div>
                                        <span class="wpf-migrator__check-icon" :class="iconClass(countStatusKey(report.counts.subscriptions_migrated, report.counts.subscriptions_total))">
                                            <component :is="iconComponent(countStatusKey(report.counts.subscriptions_migrated, report.counts.subscriptions_total))" />
                                        </span>
                                    </el-tooltip>
                                </span>
                            </li>
                            <li class="wpf-migrator__report-row">
                                <span class="wpf-migrator__report-label">Errors</span>
                                <span class="wpf-migrator__report-trailing">
                                    <span
                                        class="wpf-migrator__report-value"
                                        :class="report.counts.errors > 0 ? 'wpf-migrator__report-value--warn' : 'wpf-migrator__report-value--ok'"
                                    >{{ report.counts.errors | number }}</span>
                                </span>
                            </li>
                            <li v-if="report.counts.donations_with_gift_aid > 0" class="wpf-migrator__report-row">
                                <span class="wpf-migrator__report-label">Gift Aid Opt-ins</span>
                                <span class="wpf-migrator__report-trailing">
                                    <span class="wpf-migrator__report-value">{{ report.counts.donations_with_gift_aid | number }}</span>
                                </span>
                            </li>
                            <li v-if="report.counts.ffm_fields_migrated > 0" class="wpf-migrator__report-row">
                                <span class="wpf-migrator__report-label">FFM Fields Migrated</span>
                                <span class="wpf-migrator__report-trailing">
                                    <span class="wpf-migrator__report-value">{{ report.counts.ffm_fields_migrated | number }}</span>
                                </span>
                            </li>
                        </ul>
                    </section>

                    <section
                        v-if="report.warnings && report.warnings.length"
                        class="wpf-migrator__section"
                    >
                        <h3 class="wpf-migrator__section-title">Warnings</h3>
                        <div
                            v-for="(w, i) in report.warnings"
                            :key="w + '_' + i"
                            class="wpf-migrator__alert wpf-migrator__alert--warn"
                        >
                            <span class="wpf-migrator__check-icon wpf-migrator__check-icon--warn"><icon-warn/></span>
                            <span>{{ w }}</span>
                        </div>
                    </section>

                    <section
                        v-if="report.lossy_subscriptions && report.lossy_subscriptions.length"
                        class="wpf-migrator__section"
                    >
                        <h3 class="wpf-migrator__section-title">
                            Subscriptions With Unmapped Intervals
                            <el-tooltip
                                content="These subscriptions used a billing interval that has no direct equivalent in Paymattic. They were migrated with the closest available interval; the original interval is preserved in the notes column."
                                placement="top"
                            ><span class="wpf-migrator__hint">?</span></el-tooltip>
                        </h3>
                        <el-table :data="report.lossy_subscriptions" stripe size="small">
                            <el-table-column prop="give_sub_id" label="GiveWP Sub ID" width="140"></el-table-column>
                            <el-table-column prop="wpf_sub_id"  label="Paymattic Sub ID" width="150"></el-table-column>
                            <el-table-column prop="note"        label="Original Interval Note"></el-table-column>
                        </el-table>
                    </section>

                    <section
                        v-if="report.errors && report.errors.length"
                        class="wpf-migrator__section"
                    >
                        <h3 class="wpf-migrator__section-title">Migration Errors (last {{ report.errors.length }})</h3>
                        <ul class="wpf-migrator__error-list">
                            <li v-for="(err, i) in report.errors" :key="err + '_' + i">{{ err }}</li>
                        </ul>
                    </section>

                    <!-- Mark Complete (only when migration not yet marked) -->
                    <section
                        v-if="report.status !== 'completed' && !isDryRun"
                        class="wpf-migrator__section wpf-migrator__section--actions wpf-migrator__section--cta"
                    >
                        <p class="wpf-migrator__cta-hint">Everything looks correct? Lock in this migration.</p>
                        <button
                            class="wpf-migrator__btn wpf-migrator__btn--primary wpf-migrator__btn--block"
                            :disabled="isMarkingComplete"
                            @click="markComplete"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Mark Migration Complete
                        </button>
                    </section>

                    <!-- Post-migration action notice — webhook reconfiguration -->
                    <div class="wpf-migrator__webhook-notice">
                        <span class="wpf-migrator__webhook-notice-icon"><icon-warn/></span>
                        <div class="wpf-migrator__webhook-notice-body">
                            <strong class="wpf-migrator__webhook-notice-title">Update your payment gateway webhooks</strong>
                            <p class="wpf-migrator__webhook-notice-text">
                                Stripe, PayPal, and other gateways still send payment events to your old GiveWP endpoint. Repoint each gateway's webhook URL to Paymattic so renewals and one-time payments keep syncing.
                            </p>
                        </div>
                    </div>

                    <!-- Reset (compact danger zone — collapsible) -->
                    <section class="wpf-migrator__section wpf-migrator__danger-zone">
                        <button
                            type="button"
                            class="wpf-migrator__danger-toggle"
                            :class="{ 'wpf-migrator__danger-toggle--open': resetOpen }"
                            :aria-expanded="resetOpen ? 'true' : 'false'"
                            @click="resetOpen = !resetOpen"
                        >
                            <span class="wpf-migrator__danger-toggle-text">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                                Reset migration
                            </span>
                            <svg
                                class="wpf-migrator__danger-toggle-chevron"
                                width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            ><polyline points="6 9 12 15 18 9"/></svg>
                        </button>

                        <div v-show="resetOpen" class="wpf-migrator__danger-body">
                            <div class="wpf-migrator__danger-row">
                                <div class="wpf-migrator__danger-info">
                                    <span class="wpf-migrator__danger-title">Rollback Migration</span>
                                    <span class="wpf-migrator__danger-desc">
                                        Delete only the migrated Paymattic data. Original GiveWP data will remain unchanged. This action cannot be undone.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    class="wpf-migrator__btn wpf-migrator__btn--danger wpf-migrator__btn--sm"
                                    :disabled="isDryRun || isRollingBack"
                                    @click="confirmRollback"
                                >Rollback</button>
                            </div>

                            <div class="wpf-migrator__danger-row">
                                <div class="wpf-migrator__danger-info">
                                    <span class="wpf-migrator__danger-title">Sync Again</span>
                                    <span class="wpf-migrator__danger-desc">
                                        Import missing GiveWP data. Use Rollback if you want to import GiveWP data from scratch.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    class="wpf-migrator__btn wpf-migrator__btn--ghost wpf-migrator__btn--sm"
                                    @click="resetToStart"
                                >Sync Again</button>
                            </div>
                        </div>
                    </section>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
/**
 * GiveWPMigrator — main Vue 2 SPA component.
 *
 * localized wpfGiveWPMigrator object (ajaxUrl, nonce).
 *
 * Screen flow: preflight → migrating → report.
 * The migration loop in runMigration() calls each AJAX phase endpoint
 * repeatedly until has_more = false, accumulating counts into the phases array.
 */

const IconOk = {
    render: function (h) {
        return h('svg', {
            attrs: {
                xmlns: 'http://www.w3.org/2000/svg',
                width: 14, height: 14, viewBox: '0 0 24 24',
                fill: 'none', stroke: 'currentColor',
                'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
            },
        }, [h('polyline', { attrs: { points: '20 6 9 17 4 12' } })]);
    },
};

const IconWarn = {
    render: function (h) {
        return h('svg', {
            attrs: {
                xmlns: 'http://www.w3.org/2000/svg',
                width: 14, height: 14, viewBox: '0 0 24 24',
                fill: 'none', stroke: 'currentColor',
                'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
            },
        }, [
            h('path', { attrs: { d: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' } }),
            h('line',  { attrs: { x1: 12, y1: 9, x2: 12, y2: 13 } }),
            h('line',  { attrs: { x1: 12, y1: 17, x2: 12.01, y2: 17 } }),
        ]);
    },
};

const IconFail = {
    render: function (h) {
        return h('svg', {
            attrs: {
                xmlns: 'http://www.w3.org/2000/svg',
                width: 14, height: 14, viewBox: '0 0 24 24',
                fill: 'none', stroke: 'currentColor',
                'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
            },
        }, [
            h('circle', { attrs: { cx: 12, cy: 12, r: 10 } }),
            h('line',   { attrs: { x1: 15, y1: 9,  x2: 9,  y2: 15 } }),
            h('line',   { attrs: { x1: 9,  y1: 9,  x2: 15, y2: 15 } }),
        ]);
    },
};

const IconInfo = {
    render: function (h) {
        return h('svg', {
            attrs: {
                xmlns: 'http://www.w3.org/2000/svg',
                width: 14, height: 14, viewBox: '0 0 24 24',
                fill: 'none', stroke: 'currentColor',
                'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
            },
        }, [
            h('circle', { attrs: { cx: 12, cy: 12, r: 10 } }),
            h('line',   { attrs: { x1: 12, y1: 16, x2: 12, y2: 12 } }),
            h('line',   { attrs: { x1: 12, y1: 8,  x2: 12.01, y2: 8 } }),
        ]);
    },
};

const IconClock = {
    render: function (h) {
        return h('svg', {
            attrs: {
                xmlns: 'http://www.w3.org/2000/svg',
                width: 14, height: 14, viewBox: '0 0 24 24',
                fill: 'none', stroke: 'currentColor',
                'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
            },
        }, [
            h('circle',   { attrs: { cx: 12, cy: 12, r: 10 } }),
            h('polyline', { attrs: { points: '12 6 12 12 16 14' } }),
        ]);
    },
};

export default {
    name: 'GiveWPMigrator',

    components: {
        IconOk: IconOk,
        IconWarn: IconWarn,
        IconFail: IconFail,
        IconInfo: IconInfo,
        IconClock: IconClock,
    },

    filters: {
        number: function (value) {
            var n = parseInt(value, 10);
            if (isNaN(n)) return '0';
            if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
                return new Intl.NumberFormat().format(n);
            }
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
    },

    data: function () {
        return {
            screen: 'preflight',
            preflight: null,
            isRunningPreflight: false,
            giftAidAcknowledged: false,
            isDryRun: false,
            includeTestMode: true,
            report: null,
            currentPhase: null,

            stepperItems: [
                { key: 'preflight',  label: 'Pre-flight Check'  },
                { key: 'migrating',  label: 'Migration'         },
                { key: 'report',     label: 'Validation Report' },
            ],

            phases: [
                { key: 'forms',         label: 'Migrate Forms',         action: 'wpf_givewp_migrate_forms',         done: false, count: 0, total: 0, requiresAddon: null,             supportsHasMore: false },
                { key: 'donations',     label: 'Migrate Donations',     action: 'wpf_givewp_migrate_donations',     done: false, count: 0, total: 0, requiresAddon: null,             supportsHasMore: true  },
                { key: 'subscriptions', label: 'Migrate Subscriptions', action: 'wpf_givewp_migrate_subscriptions', done: false, count: 0, total: 0, requiresAddon: 'recurring_addon', supportsHasMore: true  },
                { key: 'gift_aid',      label: 'Gift Aid Enrichment',   action: 'wpf_givewp_enrich_gift_aid',       done: false, count: 0, total: 0, requiresAddon: 'gift_aid_addon',  supportsHasMore: true  },
                { key: 'ffm',           label: 'Custom Fields (FFM)',   action: 'wpf_givewp_enrich_ffm',            done: false, count: 0, total: 0, requiresAddon: 'ffm_addon',       supportsHasMore: true  },
            ],

            errors: [],
            isRunning: false,
            isMarkingComplete: false,
            isRollingBack: false,
            resetOpen: false,
        };
    },

    mounted: function () {
        var self = this;
        self.ajax('wpf_givewp_get_migration_state').then(function (state) {
            if (!state || state.status !== 'completed') return;
            self.screen = 'report';
            self.loadReport();
        }).catch(function () {
            // Non-fatal — stay on default preflight screen.
        });
    },

    computed: {
        // GiveWP plugin install/active status — exposed by GiveWPMigrationModule
        // via wpPayFormsAdmin.wppayform_migrator.givewpActive so we can gate the
        // Pre-flight button before any AJAX is issued.
        isGiveWpActive: function () {
            var cfg = (window.wpPayFormsAdmin && window.wpPayFormsAdmin.wppayform_migrator) || {};
            return !!cfg.givewpActive;
        },

        canStartMigration: function () {
            if (!this.preflight) return false;
            if (!this.preflight.givewp_active) return false;
            if (this.preflight.gift_aid_addon && !this.giftAidAcknowledged) return false;
            return true;
        },

        // Paymattic "All Forms" admin URL — shown as post-migration CTA so
        // the admin lands directly on the migrated forms list.
        formsListUrl: function () {
            return (typeof window !== 'undefined' && window.wpPayFormsAdmin && window.wpPayFormsAdmin.admin_url)
                ? window.wpPayFormsAdmin.admin_url + 'admin.php?page=wppayform.php#/'
                : 'admin.php?page=wppayform.php#/';
        },

        activePhasesForRun: function () {
            var self = this;
            return this.phases.filter(function (phase) {
                if (!phase.requiresAddon) return true;
                return !!(self.preflight && self.preflight[phase.requiresAddon]);
            });
        },

        gateMessage: function () {
            if (!this.preflight) return '';
            if (!this.preflight.givewp_active) {
                return 'GiveWP must be active to run the migration.';
            }
            if (this.preflight.gift_aid_addon && !this.giftAidAcknowledged) {
                return 'Check the Gift Aid acknowledgement above to enable the start button.';
            }
            return '';
        },

        // Group preflight.missing_features by category. Only "lost" (Not
        // supported) items are surfaced — Pro-required / partial items are
        // intentionally hidden since Paymattic supports them.
        missingFeaturesGrouped: function () {
            if (!this.preflight || !this.preflight.missing_features) return [];

            var byCategory = {};
            var order      = [];

            this.preflight.missing_features.forEach(function (item) {
                if (item.severity !== 'lost') return;
                // Integrations group temporarily hidden in UI until support lands.
                if (item.category === 'Integrations') return;
                if (!byCategory[item.category]) {
                    byCategory[item.category] = [];
                    order.push(item.category);
                }
                byCategory[item.category].push(item);
            });

            return order.map(function (cat) {
                return { category: cat, items: byCategory[cat] };
            });
        },
    },

    methods: {
        stepState: function (idx) {
            // 0 preflight, 1 migrating, 2 report
            // Treat preflight as "done" once results are loaded (about to start migration).
            var done = 0;
            if (this.preflight && this.screen === 'preflight') done = 1;
            if (this.screen === 'migrating') done = 1;
            if (this.screen === 'report')   done = 2;

            if (idx < done) return 'done';
            if (idx === done) {
                // current visual: migration if preflight is done and we are pre/in migration,
                // preflight if no results yet.
                if (this.screen === 'preflight' && !this.preflight) return 'active';
                return 'active';
            }
            return 'wait';
        },

        iconClass: function (status) {
            return 'wpf-migrator__check-icon--' + status;
        },

        iconComponent: function (status) {
            switch (status) {
                case 'ok':   return 'IconOk';
                case 'warn': return 'IconWarn';
                case 'fail': return 'IconFail';
                case 'info':
                default:     return 'IconInfo';
            }
        },

        countStatusKey: function (migrated, total) {
            if (total === 0) return 'info';
            if (migrated >= total) return 'ok';
            if (migrated > 0) return 'warn';
            return 'fail';
        },

        severityLabel: function (severity) {
            switch (severity) {
                case 'lost':         return 'Not supported';
                case 'pro_required': return 'Needs Pro';
                case 'manual_step':  return 'Action needed';
                case 'partial':      return 'Partial';
                default:             return 'Note';
            }
        },

        // ------------------------------------------------------------------
        // AJAX helper
        // ------------------------------------------------------------------
        ajax: function (action, data) {
            var config = (window.wpPayFormsAdmin && window.wpPayFormsAdmin.wppayform_migrator)
                ? window.wpPayFormsAdmin.wppayform_migrator
                : (window.wpfGiveWPMigrator || {});

            return new Promise(function (resolve, reject) {
                window.jQuery.ajax({
                    url: config.ajaxUrl || ajaxurl,
                    type: 'POST',
                    data: Object.assign({}, data, {
                        action: action,
                        _ajax_nonce: config.nonce,
                    }),
                    success: function (response) {
                        if (response && response.success) {
                            resolve(response.data);
                        } else {
                            var msg = (response && response.data && response.data.message)
                                ? response.data.message
                                : 'Unknown error from ' + action;
                            reject(new Error(msg));
                        }
                    },
                    error: function (xhr, status, error) {
                        reject(new Error('AJAX error on ' + action + ': ' + (error || status)));
                    },
                });
            });
        },

        // ------------------------------------------------------------------
        // SCREEN: PREFLIGHT
        // ------------------------------------------------------------------
        runPreflight: function () {
            var self = this;
            self.isRunningPreflight = true;
            self.preflight = null;

            self.ajax('wpf_givewp_preflight').then(function (data) {
                self.preflight = data;
                self.isRunningPreflight = false;
            }).catch(function (err) {
                self.isRunningPreflight = false;
                self.$message.error('Pre-flight check failed: ' + err.message);
            });
        },

        resetWelcome: function () {
            this.preflight = null;
            this.giftAidAcknowledged = false;
            this.errors = [];
        },

        startMigration: function () {
            if (!this.canStartMigration) return;
            this.phases.forEach(function (phase) {
                phase.done = false;
                phase.count = 0;
                phase.total = 0;
            });
            this.errors = [];
            this.screen = 'migrating';
            this.runMigration();
        },

        // ------------------------------------------------------------------
        // SCREEN: MIGRATING
        // ------------------------------------------------------------------
        runPhase: function (phase, corePhases) {
            var self = this;
            var isCore = corePhases.indexOf(phase.key) !== -1;

            if (phase.key === 'donations' && self.preflight && self.preflight.give_donation_count) {
                phase.total = self.preflight.give_donation_count;
            }

            var batchCount = 0;

            var runBatch = function () {
                if (!phase.supportsHasMore) {
                    return self.ajax(phase.action, {
                        dry_run: self.isDryRun ? '1' : '0',
                    }).then(function (formResult) {
                        phase.count = formResult.migrated || 0;
                        phase.total = formResult.total || 0;
                        return self.syncErrors();
                    });
                }

                var extraData = {
                    batch_size: 50,
                    dry_run: self.isDryRun ? '1' : '0',
                };
                if (phase.key === 'donations' && self.includeTestMode) {
                    extraData.include_test_mode = '1';
                }

                return self.ajax(phase.action, extraData).then(function (result) {
                    var batchMigrated = result.batch_migrated || result.migrated || result.enriched || 0;
                    phase.count += batchMigrated;
                    batchCount++;

                    var syncPromise = (batchCount % 10 === 0)
                        ? self.syncErrors()
                        : Promise.resolve();

                    return syncPromise.then(function () {
                        if (result.has_more) {
                            return runBatch();
                        }
                        return self.syncErrors();
                    });
                });
            };

            return runBatch().then(function () {
                phase.done = true;
            }).catch(function (phaseErr) {
                if (isCore) {
                    throw phaseErr;
                }
                self.errors.push('Phase "' + phase.label + '" failed: ' + phaseErr.message);
                phase.done = true;
            });
        },

        runMigration: function () {
            var self = this;
            self.isRunning = true;
            var corePhases = ['forms', 'donations', 'subscriptions'];

            var chain = Promise.resolve();
            self.activePhasesForRun.forEach(function (phase) {
                chain = chain.then(function () {
                    self.currentPhase = phase.key;
                    return self.runPhase(phase, corePhases);
                });
            });

            chain.then(function () {
                self.currentPhase = null;
                if (!self.isDryRun) {
                    return self.ajax('wpf_givewp_mark_complete');
                }
            }).then(function () {
                return self.loadReport();
            }).then(function () {
                self.screen = 'report';
                self.isRunning = false;
            }).catch(function (err) {
                self.isRunning = false;
                self.currentPhase = null;
                self.$message.error('Migration stopped: ' + err.message);
                self.errors.push('Fatal: ' + err.message);
            });
        },

        syncErrors: function () {
            var self = this;
            return self.ajax('wpf_givewp_get_migration_state').then(function (state) {
                if (state && state.errors && state.errors.length) {
                    self.errors = state.errors.slice();
                }
            }).catch(function () {
                // Non-fatal.
            });
        },

        phaseProgress: function (phase) {
            if (phase.total > 0) {
                return Math.min(99, Math.round((phase.count / phase.total) * 100));
            }
            return 50;
        },

        // ------------------------------------------------------------------
        // SCREEN: REPORT
        // ------------------------------------------------------------------
        loadReport: function () {
            var self = this;
            self.report = null;
            return self.ajax('wpf_givewp_generate_report').then(function (data) {
                self.report = data;
            });
        },

        markComplete: function () {
            var self = this;
            if (self.isDryRun || (self.report && self.report.status === 'completed')) {
                return;
            }
            self.isMarkingComplete = true;
            self.ajax('wpf_givewp_mark_complete').then(function () {
                self.isMarkingComplete = false;
                self.$message.success('Migration marked as complete.');
                self.loadReport();
            }).catch(function (err) {
                self.isMarkingComplete = false;
                self.$message.error('Failed to mark complete: ' + err.message);
            });
        },

        confirmRollback: function () {
            var self = this;
            self.ajax('wpf_givewp_rollback', { dry_run: '1' }).then(function (counts) {
                var summary = [
                    counts.submissions_deleted + ' submissions',
                    counts.subscriptions_deleted + ' subscriptions',
                    counts.forms_deleted + ' forms',
                    counts.meta_rows_deleted + ' meta rows',
                    counts.order_items_deleted + ' order items',
                    counts.transactions_deleted + ' transactions',
                    counts.activities_deleted + ' activity entries',
                ].join(', ');

                return self.$confirm(
                    'This will permanently delete the following Paymattic data created by this migration:\n\n' +
                    summary + '\n\nGiveWP data is never deleted. This action cannot be undone.',
                    'Confirm Rollback',
                    {
                        confirmButtonText: 'Yes, Roll Back',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                        dangerouslyUseHTMLString: false,
                    }
                );
            }).then(function () {
                self.isRollingBack = true;
                return self.ajax('wpf_givewp_rollback', { dry_run: '0' });
            }).then(function (result) {
                self.isRollingBack = false;
                self.$message.success(
                    'Rollback complete. ' +
                    result.submissions_deleted + ' submissions and ' +
                    result.forms_deleted + ' forms deleted.'
                );
                self.resetToStart();
            }).catch(function (err) {
                self.isRollingBack = false;
                if (err && err.message && err.message !== 'cancel') {
                    self.$message.error('Rollback failed: ' + err.message);
                }
            });
        },

        resetToStart: function () {
            var self = this;
            self.ajax('wpf_givewp_reset_migration').then(function () {
                self.screen = 'preflight';
                self.preflight = null;
                self.report = null;
                self.errors = [];
                self.giftAidAcknowledged = false;
                self.isDryRun = false;
                self.currentPhase = null;
                self.phases.forEach(function (phase) {
                    phase.done = false;
                    phase.count = 0;
                    phase.total = 0;
                });
            }).catch(function (err) {
                self.$message.error('Reset failed: ' + err.message);
            });
        },

        downloadReport: function () {
            if (!this.report) return;
            var data = JSON.stringify(this.report, null, 2);
            var blob = new Blob([data], { type: 'application/json' });
            var url  = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href     = url;
            link.download = 'givewp-migration-report-' + Date.now() + '.json';
            document.body.appendChild(link);
            link.click();
            setTimeout(function () {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        },

    },
};
</script>

<style lang="scss" scoped>
@import '../../scss/admin/admin_variables';

// =============================================================================
// Local design tokens
// =============================================================================
$wpf-migrator-bg:           #f5f6f8;
$wpf-migrator-surface:      #ffffff;
$wpf-migrator-ink:          #0f1729;   // primary text + dark CTA
$wpf-migrator-ink-soft:     #2f3548;
$wpf-migrator-muted:        #6b7280;
$wpf-migrator-soft:         #9aa3b2;
$wpf-migrator-line:         #e7e9ee;
$wpf-migrator-line-strong:  #d8dce4;

$wpf-migrator-ok:           #10a36a;
$wpf-migrator-ok-soft:      #eaf7f0;
$wpf-migrator-ok-line:      #c5e6d3;

$wpf-migrator-warn:         #c08400;
$wpf-migrator-warn-soft:    #fbf3df;
$wpf-migrator-warn-line:    #f0dfa6;

$wpf-migrator-fail:         #d4453f;
$wpf-migrator-fail-soft:    #fbecec;
$wpf-migrator-fail-line:    #f0c8c6;

$wpf-migrator-info:         #5b6273;
$wpf-migrator-info-soft:    #f1f3f6;

$wpf-migrator-accent:       $wpf-migrator-ok;          // success tint for success tiles
$wpf-migrator-radius:       12px;
$wpf-migrator-radius-sm:    8px;

// =============================================================================
// Root
// =============================================================================
.wpf-migrator {
    // max-width: 880px;
    max-width: 100%;
    margin: 0 auto;
    padding: 30px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: $wpf-migrator-ink;
    background: #fff;
    // min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    border-radius: 8px;

    *, *::before, *::after { box-sizing: border-box; }

    // -------------------------------------------------------------------------
    // Stepper
    // -------------------------------------------------------------------------
    &__stepper {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        margin: 8px auto 40px;
        max-width: 620px;
        position: relative;
    }

    &__stepper-item {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        min-width: 0;
    }

    &__stepper-node {
        position: relative;
        z-index: 2;
    }

    &__stepper-circle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        font-size: 13px;
        font-weight: 600;
        background: $wpf-migrator-surface;
        border: 1.5px solid $wpf-migrator-line-strong;
        color: $wpf-migrator-soft;
        transition: all 200ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    &__stepper-label {
        margin-top: 10px;
        font-size: 12.5px;
        font-weight: 500;
        color: $wpf-migrator-soft;
        white-space: nowrap;
    }

    &__stepper-connector {
        position: absolute;
        top: 16px;
        left: calc(50% + 22px);
        right: calc(-50% + 22px);
        height: 2px;
        background: $wpf-migrator-line-strong;
        z-index: 1;

        &--done { background: $wpf-active; }
    }

    // Stepper state variants
    &__stepper-item--done {
        .wpf-migrator__stepper-circle {
            background: $wpf-active;
            border-color: $wpf-active;
            color: #fff;
        }
        .wpf-migrator__stepper-label { color: $wpf-active; font-weight: 600; }
    }

    &__stepper-item--active {
        .wpf-migrator__stepper-circle {
            background: $wpf-active;
            border-color: $wpf-active;
            color: #fff;
        }
        .wpf-migrator__stepper-label { color: $wpf-active; font-weight: 600; }
    }

    // -------------------------------------------------------------------------
    // Title row (above panel)
    // -------------------------------------------------------------------------
    &__title-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin: 0 4px 14px;
        gap: 12px;
    }

    &__page-title {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: -0.01em;
        color: $wpf-migrator-ink;
    }

    &__title-meta {
        font-size: 12px;
        color: $wpf-migrator-muted;
    }

    &__link {
        background: transparent;
        border: 0;
        padding: 0;
        color: $wpf-migrator-muted;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: color 150ms;

        &:hover { color: $wpf-migrator-ink; text-decoration: underline; text-underline-offset: 3px; }
    }

    // -------------------------------------------------------------------------
    // Panel (the main card)
    // -------------------------------------------------------------------------
    &__panel {
        background: $wpf-migrator-surface;
        border-radius: $wpf-migrator-radius;
        overflow: hidden;
        border: 1px solid $wpf-migrator-line;
        box-shadow: 0 1px 4px rgba(15, 23, 41, 0.05), 0 1px 2px rgba(15, 23, 41, 0.03);
    }

    // -------------------------------------------------------------------------
    // Sections inside panel
    // -------------------------------------------------------------------------
    &__section {
        padding: 24px 28px;
        border-bottom: 1px solid $wpf-migrator-line;

        &:last-child { border-bottom: 0; }

        &--inset {
            padding: 20px 28px;
            background: #fafbfc;
        }
    }

    &__section-title {
        margin: 0 0 16px;
        font-size: 14px;
        font-weight: 700;
        color: $wpf-migrator-ink-soft;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    // -------------------------------------------------------------------------
    // System status checks
    // -------------------------------------------------------------------------
    &__checks {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__check {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: $wpf-migrator-ink-soft;
    }

    &__check-text--muted { color: $wpf-migrator-muted; }

    &__check-icon {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1.5px solid;

        &--ok,
        &--success { color: $wpf-migrator-ok;   border-color: $wpf-migrator-ok-line;   background: $wpf-migrator-ok-soft; }
        &--warn    { color: $wpf-migrator-warn; border-color: $wpf-migrator-warn-line; background: $wpf-migrator-warn-soft; cursor: help; }
        &--fail    { color: $wpf-migrator-fail; border-color: $wpf-migrator-fail-line; background: $wpf-migrator-fail-soft; }
        &--info    { color: $wpf-migrator-info; border-color: $wpf-migrator-line-strong; background: $wpf-migrator-info-soft; }
    }

    &__tooltip {
        max-width: 320px;
        line-height: 1.5;
        ul li { font-size: 12.5px; }
    }

    // -------------------------------------------------------------------------
    // Migration preview tiles
    // -------------------------------------------------------------------------
    &__tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
    }

    &__tile {
        padding: 20px 18px 18px;
        border: 1px solid $wpf-migrator-line;
        border-radius: $wpf-migrator-radius-sm;
        background: #fbfbfc;
        display: flex;
        flex-direction: column;
        gap: 6px;
        transition: border-color 150ms, background 150ms;

        &--success {
            background: $wpf-migrator-ok-soft;
            border-color: $wpf-migrator-ok-line;

            .wpf-migrator__tile-number, .wpf-migrator__tile-label { color: darken($wpf-migrator-ok, 6%); }
        }

        &--warn {
            background: $wpf-migrator-warn-soft;
            border-color: $wpf-migrator-warn-line;

            .wpf-migrator__tile-number, .wpf-migrator__tile-label { color: darken($wpf-migrator-warn, 4%); }
        }
    }

    &__tile-number {
        font-size: 30px;
        font-weight: 500;
        line-height: 1;
        color: $wpf-migrator-ink;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
    }

    &__tile-label {
        font-size: 12px;
        color: $wpf-migrator-muted;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    // -------------------------------------------------------------------------
    // Missing in Paymattic — compatibility-gap catalog
    // -------------------------------------------------------------------------
    &__section-intro {
        margin: -8px 0 18px;
        font-size: 13px;
        line-height: 1.6;
        color: $wpf-migrator-muted;

        strong {
            color: $wpf-migrator-ink-soft;
            font-weight: 600;
        }
    }

    &__missing-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 6px;

        .wpf-migrator__section-title { margin: 0; }
    }

    &__missing-group {
        & + & { margin-top: 14px; }
    }

    &__missing-category {
        margin: 0 0 10px;
        font-size: 12px;
        font-weight: 600;
        color: $wpf-migrator-muted;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    &__missing-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    &__missing-chip {
        display: inline-flex;
        align-items: center;
        padding: 7px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        color: $wpf-migrator-ink-soft;
        background: $wpf-migrator-surface;
        border: 1px solid $wpf-migrator-line-strong;
        transition: border-color 150ms, background 150ms;

        &:hover {
            background: #fafbfc;
            border-color: $wpf-migrator-line-strong;
        }
    }

    &__missing-footer {
        margin: 18px 0 0;
        padding-top: 14px;
        border-top: 1px dashed $wpf-migrator-line;
        font-size: 13px;
        color: $wpf-migrator-muted;

        a {
            color: $wpf-active;
            text-decoration: none;
            font-weight: 500;

            &:hover { text-decoration: underline; }
        }
    }

    &__missing-badge {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.01em;
        white-space: nowrap;
        border: 1px solid transparent;
        text-transform: uppercase;

        &--lost {
            color: $wpf-migrator-fail;
            background: $wpf-migrator-fail-soft;
            border-color: $wpf-migrator-fail-line;

            &::before {
                content: '';
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: $wpf-migrator-fail;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Migration options (custom checkboxes)
    // -------------------------------------------------------------------------
    &__option {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 10px 0;
        cursor: pointer;
        user-select: none;

        & + .wpf-migrator__option { border-top: 1px solid $wpf-migrator-line; }

        input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
            pointer-events: none;
        }

        &-box {
            flex-shrink: 0;
            width: 18px;
            height: 18px;
            margin-top: 2px;
            border-radius: 4px;
            border: 1.5px solid $wpf-migrator-line-strong;
            background: $wpf-migrator-surface;
            position: relative;
            transition: all 150ms cubic-bezier(0.22, 1, 0.36, 1);

            &::after {
                content: '';
                position: absolute;
                left: 4.5px;
                top: 1px;
                width: 5px;
                height: 9px;
                border: solid #fff;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg) scale(0);
                transition: transform 120ms ease-out;
            }
        }

        input:checked ~ &-box {
            background: $wpf-active;
            border-color: $wpf-active;

            &::after { transform: rotate(45deg) scale(1); }
        }

        input:focus-visible ~ &-box {
            box-shadow: 0 0 0 3px rgba($wpf-active, 0.18);
        }

        &-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        &-title {
            font-size: 14px;
            font-weight: 600;
            color: $wpf-migrator-ink;
        }

        &-sub {
            font-size: 12.5px;
            color: $wpf-migrator-muted;
            line-height: 1.5;
        }

        &--required .wpf-migrator__option-title::after {
            content: ' • required';
            font-weight: 500;
            color: $wpf-migrator-fail;
        }

        &:hover .wpf-migrator__option-box { border-color: $wpf-migrator-ink; }
    }

    // -------------------------------------------------------------------------
    // Welcome state
    // -------------------------------------------------------------------------
    &__welcome {
        padding: 36px 40px 36px;
        text-align: center;
    }

    &__welcome-bridge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        margin-bottom: 20px;
    }

    &__brand-mark {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;

        svg { display: block; }

        // Both brand icons ship their own colored tile — drop outer container chrome.
        &--give,
        &--paymattic {
            background: transparent;
            border: 0;
            border-radius: 0;
        }
    }

    &__welcome-arrow {
        display: flex;
        align-items: center;
        color: $wpf-migrator-line-strong;
        animation: wpf-migrator-pulse 2.2s ease-in-out infinite;
    }

    &__welcome-title {
        margin: 0 0 10px;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: -0.01em;
    }

    &__welcome-sub {
        margin: 0 auto 22px;
        max-width: 56ch;
        font-size: 14px;
        line-height: 1.65;
        color: $wpf-migrator-muted;
    }

    &__welcome-warning {
        display: inline-flex;
        align-items: flex-start;
        gap: 10px;
        text-align: left;
        background: $wpf-migrator-warn-soft;
        border: 1px solid $wpf-migrator-warn-line;
        border-radius: $wpf-migrator-radius-sm;
        padding: 12px 16px;
        font-size: 13px;
        color: darken($wpf-migrator-warn, 8%);
        margin: 0 auto 24px;

        svg { color: $wpf-migrator-warn; flex-shrink: 0; margin-top: 1px; }
        strong { color: darken($wpf-migrator-warn, 12%); font-weight: 600; }
    }

    // -------------------------------------------------------------------------
    // Loading state
    // -------------------------------------------------------------------------
    &__loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        padding: 56px 32px;
        font-size: 14px;
        color: $wpf-migrator-muted;
    }

    &__spinner {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 2px solid $wpf-migrator-line-strong;
        border-top-color: $wpf-migrator-ink;
        border-radius: 50%;
        animation: wpf-migrator-spin 0.8s linear infinite;

        &--small { width: 14px; height: 14px; border-width: 1.8px; }
    }

    // -------------------------------------------------------------------------
    // Footer actions (Back / Start)
    // -------------------------------------------------------------------------
    &__footer {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;

        > .wpf-migrator__btn {
            min-width: 140px;
        }

        > .wpf-migrator__btn--ghost {
            background: transparent;
            border-color: $wpf-migrator-line-strong;
            color: $wpf-migrator-ink-soft;

            &:hover:not(:disabled) {
                background: $wpf-migrator-surface;
                color: $wpf-migrator-ink;
                border-color: $wpf-migrator-ink-soft;
            }
        }

        > .wpf-migrator__btn--primary {
            min-width: 180px;
            box-shadow: 0 2px 6px rgba(232, 157, 44, 0.28);

            &:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 4px 10px rgba(232, 157, 44, 0.36);
            }

            &:active:not(:disabled) {
                transform: translateY(0);
                box-shadow: 0 1px 3px rgba(232, 157, 44, 0.24);
            }

            > svg {
                transition: transform 150ms cubic-bezier(0.22, 1, 0.36, 1);
            }

            &:hover:not(:disabled) > svg {
                transform: translateX(2px);
            }
        }
    }

    &__gate-hint {
        margin: 10px 4px 0;
        font-size: 12.5px;
        color: $wpf-migrator-warn;
    }

    // -------------------------------------------------------------------------
    // Buttons
    // -------------------------------------------------------------------------
    button,
    a,
    label,
    [role="button"],
    [role="link"] {
        cursor: pointer !important;
    }

    button:disabled,
    button[disabled],
    button[aria-disabled="true"],
    a[aria-disabled="true"] {
        cursor: not-allowed !important;
    }

    &__btn-wrap {
        display: block;
        width: 100%;
        max-width: 280px;
        margin: 0 auto;

        > .wpf-migrator__btn--block { margin: 0; }
    }

    &__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 0 22px;
        height: 42px;
        border-radius: $wpf-migrator-radius-sm;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.005em;
        cursor: pointer;
        border: 1.5px solid transparent;
        transition: background 150ms, border-color 150ms, color 150ms, transform 150ms cubic-bezier(0.22, 1, 0.36, 1);
        white-space: nowrap;

        &:disabled, &[disabled] {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }

        &:active:not(:disabled) { transform: translateY(1px); }

        &--primary {
            background: $wpf-active;
            color: #fff;
            border-color: $wpf-active;

            &:hover:not(:disabled) { background: darken($wpf-active, 6%); border-color: darken($wpf-active, 6%); }
        }

        &--ghost {
            background: $wpf-migrator-surface;
            color: $wpf-migrator-ink;
            border-color: $wpf-migrator-line-strong;

            &:hover:not(:disabled) { background: #fafbfc; border-color: $wpf-migrator-ink-soft; }
        }

        &--success {
            background: $wpf-migrator-ok;
            color: #fff;
            border-color: $wpf-migrator-ok;

            &:hover:not(:disabled) { background: darken($wpf-migrator-ok, 6%); border-color: darken($wpf-migrator-ok, 6%); }
        }

        &--danger {
            background: $wpf-migrator-surface;
            color: $wpf-migrator-fail;
            border-color: $wpf-migrator-fail-line;

            &:hover:not(:disabled) { background: $wpf-migrator-fail-soft; border-color: $wpf-migrator-fail; }
        }

        &--block { width: 100%; max-width: 280px; margin: 0 auto; display: flex; }

        &--sm {
            height: 34px;
            padding: 0 14px;
            font-size: 13px;
            border-radius: 6px;
        }
    }

    // -------------------------------------------------------------------------
    // Alerts (warning / info / error / success banners inside panel)
    // -------------------------------------------------------------------------
    &__alert {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 14px;
        border-radius: $wpf-migrator-radius-sm;
        font-size: 13px;
        line-height: 1.5;

        & + & { margin-top: 8px; }

        &--block {
            margin: 18px 0;
            justify-content: flex-start;
            text-align: left;
            padding: 16px 20px;
            border: 1px solid transparent;
        }

        &--success.wpf-migrator__alert--block {
            background: $wpf-migrator-ok-soft;
            border-color: $wpf-migrator-ok-line;
            color: darken($wpf-migrator-ok, 14%);
        }

        &--completed {
            padding: 20px 24px;
            
            .wpf-migrator__check-icon {
                width: 28px;
                height: 28px;

                svg { width: 14px; height: 14px; }
            }

            .wpf-migrator__alert-content {
                font-size: 15px;
                font-weight: 600;
                gap: 14px;
                flex: 1 1 auto;
            }

            display: flex;
            align-items: center;
            gap: 16px;

            .wpf-migrator__btn--sm {
                flex: 0 0 auto;
            }
        }

        &--info    { background: $wpf-migrator-info-soft; color: $wpf-migrator-ink-soft; }
        &--success { background: $wpf-migrator-ok-soft;   color: darken($wpf-migrator-ok, 14%); }
        &--warn    { background: $wpf-migrator-warn-soft; color: darken($wpf-migrator-warn, 10%); }
        &--error   { background: $wpf-migrator-fail-soft; color: darken($wpf-migrator-fail, 10%); }
    }

    &__alert-content {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
    }

    // -------------------------------------------------------------------------
    // Error list
    // -------------------------------------------------------------------------
    &__error-list {
        margin: 10px 0 0;
        padding-left: 22px;
        font-size: 12.5px;
        line-height: 1.7;
        color: $wpf-migrator-fail;
        font-family: 'SF Mono', 'JetBrains Mono', Menlo, monospace;

        li { list-style: disc; }
    }

    // -------------------------------------------------------------------------
    // Migration phases (migrating screen)
    // -------------------------------------------------------------------------
    &__phases {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__phase {
        padding: 14px 16px;
        border: 1px solid $wpf-migrator-line;
        border-radius: $wpf-migrator-radius-sm;
        background: #fbfbfc;
        transition: background 200ms, border-color 200ms;

        &--active {
            background: $wpf-migrator-surface;
            border-color: $wpf-active;
            box-shadow: 0 0 0 3px rgba($wpf-active, 0.1);
        }

        &--done {
            background: $wpf-migrator-ok-soft;
            border-color: $wpf-migrator-ok-line;
        }
    }

    &__phase-head {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
    }

    &__phase-icon {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        color: $wpf-migrator-muted;

        .wpf-migrator__phase--done & { color: $wpf-migrator-ok; }
        .wpf-migrator__phase--active & { color: $wpf-active; }
    }

    &__phase-label {
        font-size: 13.5px;
        font-weight: 600;
        color: $wpf-migrator-ink-soft;
    }

    &__phase-count {
        margin-left: auto;
        font-size: 12px;
        color: $wpf-migrator-muted;
        font-variant-numeric: tabular-nums;
    }

    // Custom progress bar
    &__bar {
        height: 6px;
        background: $wpf-migrator-line;
        border-radius: 999px;
        overflow: hidden;
    }

    &__bar-fill {
        display: block;
        height: 100%;
        background: $wpf-active;
        border-radius: 999px;
        transition: width 400ms cubic-bezier(0.22, 1, 0.36, 1);

        &--done { background: $wpf-migrator-ok; }
    }

    // -------------------------------------------------------------------------
    // Report rows
    // -------------------------------------------------------------------------
    &__report-rows {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    &__report-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 14px 0;
        border-bottom: 1px solid $wpf-migrator-line;
        font-size: 14px;

        &:last-child { border-bottom: 0; }
    }

    &__report-label {
        color: $wpf-migrator-ink-soft;
        font-weight: 500;
    }

    &__report-trailing {
        display: inline-flex;
        align-items: center;
        gap: 10px;

        .wpf-migrator__check-icon {
            width: 18px;
            height: 18px;
            border-width: 1.2px;

            svg { width: 10px; height: 10px; }
        }
    }

    &__report-value {
        font-weight: 500;
        font-size: 14px;
        color: $wpf-migrator-ink-soft;
        font-variant-numeric: tabular-nums;

        &--ok   { color: $wpf-migrator-ok; font-weight: 600; }
        &--warn { color: $wpf-migrator-warn; font-weight: 600; }
    }

    &__report-of {
        font-size: 13px;
        font-weight: 400;
        color: $wpf-migrator-soft;
        margin-left: 2px;
    }


    // -------------------------------------------------------------------------
    // Actions section override (sentence-case bold heading instead of uppercase tracked)
    // -------------------------------------------------------------------------
    &__section--actions,
    &__section--summary {
        padding-top: 28px;
    }

    &__section--cta {
        text-align: center;
        padding: 28px 32px 32px;
    }

    &__cta-hint {
        margin: 0 0 16px;
        font-size: 13px;
        color: $wpf-migrator-muted;
        line-height: 1.5;
    }

    // -------------------------------------------------------------------------
    // Migration Summary — header row with inline Download JSON action.
    // -------------------------------------------------------------------------
    &__summary-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;

        .wpf-migrator__section-heading { margin: 0; }
    }

    &__summary-action {
        appearance: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border: 1px solid $wpf-migrator-line-strong;
        border-radius: $wpf-migrator-radius-sm;
        background: $wpf-migrator-surface;
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 500;
        color: $wpf-migrator-ink-soft;
        transition: border-color 150ms, color 150ms, background 150ms;

        &:hover {
            border-color: $wpf-migrator-ink;
            color: $wpf-migrator-ink;
            background: #fafbfc;
        }

        svg { color: $wpf-migrator-muted; transition: color 150ms; }
        &:hover svg { color: $wpf-migrator-ink; }
    }

    // -------------------------------------------------------------------------
    // Webhook notice — post-migration action callout above Reset zone.
    // -------------------------------------------------------------------------
    &__webhook-notice {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin: 24px 24px 10px 24px;
        padding: 14px 16px;
        background: $wpf-migrator-warn-soft;
        border: 1px solid rgba($wpf-migrator-warn, 0.28);
        border-radius: $wpf-migrator-radius-sm;
    }

    &__webhook-notice-icon {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        margin-top: 1px;
        border-radius: 999px;
        background: rgba($wpf-migrator-warn, 0.18);
        color: darken($wpf-migrator-warn, 8%);
    }

    &__webhook-notice-body {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    &__webhook-notice-title {
        display: block;
        font-size: 13.5px;
        font-weight: 600;
        line-height: 1.4;
        color: darken($wpf-migrator-warn, 18%);
    }

    &__webhook-notice-text {
        margin: 0;
        font-size: 13px;
        line-height: 1.55;
        color: $wpf-migrator-ink-soft;
    }

    // -------------------------------------------------------------------------
    // Danger Zone — compact collapsible Reset section.
    // -------------------------------------------------------------------------
    &__danger-zone {
        padding: 16px 24px 20px;
    }

    &__danger-toggle {
        appearance: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        padding: 14px 20px;
        border: 1px solid $wpf-migrator-line;
        border-radius: $wpf-migrator-radius-sm;
        background: transparent;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        color: $wpf-migrator-muted;
        transition: border-color 150ms, color 150ms, background 150ms;

        &:hover {
            border-color: $wpf-migrator-fail-line;
            color: $wpf-migrator-fail;
            background: $wpf-migrator-fail-soft;
        }

        &:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px rgba(212, 69, 63, 0.18);
        }

        &--open {
            border-color: $wpf-migrator-fail-line;
            color: $wpf-migrator-fail;
            background: $wpf-migrator-fail-soft;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    &__danger-toggle-text {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    &__danger-toggle-chevron {
        transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);

        .wpf-migrator__danger-toggle--open & { transform: rotate(180deg); }
    }

    &__danger-body {
        border: 1px solid $wpf-migrator-fail-line;
        border-top: 0;
        border-radius: 0 0 $wpf-migrator-radius-sm $wpf-migrator-radius-sm;
        background: $wpf-migrator-surface;
        padding: 0 20px;
    }

    &__danger-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 18px 0;

        & + & { border-top: 1px dashed $wpf-migrator-line; }
    }

    &__danger-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        padding-right: 8px;
    }

    &__danger-title {
        font-size: 14px;
        font-weight: 600;
        color: $wpf-migrator-ink;
        letter-spacing: -0.005em;
    }

    &__danger-desc {
        font-size: 12.5px;
        line-height: 1.55;
        color: $wpf-migrator-muted;
    }

    &__section-heading {
        margin: 0 0 18px;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: -0.01em;
        color: $wpf-migrator-ink;
    }

    // -------------------------------------------------------------------------
    // Action cards (report screen) — whole card is the affordance
    // -------------------------------------------------------------------------
    &__action-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
    }

    &__action-card {
        appearance: none;
        font-family: inherit;
        text-align: left;
        cursor: pointer;
        background: $wpf-migrator-surface;
        border: 1px solid $wpf-migrator-line-strong;
        border-radius: $wpf-migrator-radius;
        padding: 20px 22px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: border-color 160ms, background 160ms, transform 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 160ms;

        &:hover:not(:disabled) {
            border-color: $wpf-migrator-ink-soft;
            box-shadow: 0 4px 14px rgba(15, 23, 41, 0.06);
        }

        &:active:not(:disabled) { transform: translateY(1px); }

        &:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px rgba(15, 23, 41, 0.18);
        }

        &:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }

        &--span { grid-column: 1 / -1; }

        &--danger {
            border-color: $wpf-migrator-fail-line;
            background: lighten($wpf-migrator-fail-soft, 4%);

            .wpf-migrator__action-card-title { color: $wpf-migrator-fail; }

            &:hover:not(:disabled) {
                border-color: $wpf-migrator-fail;
                background: $wpf-migrator-fail-soft;
                box-shadow: 0 4px 14px rgba(212, 69, 63, 0.12);
            }

            &:focus-visible { box-shadow: 0 0 0 3px rgba(212, 69, 63, 0.22); }
        }

        &--success {
            border-color: $wpf-migrator-ok-line;
            background: lighten($wpf-migrator-ok-soft, 2%);

            .wpf-migrator__action-card-title { color: $wpf-migrator-ok; }

            &:hover:not(:disabled) {
                border-color: $wpf-migrator-ok;
                background: $wpf-migrator-ok-soft;
                box-shadow: 0 4px 14px rgba(16, 163, 106, 0.12);
            }

            &:focus-visible { box-shadow: 0 0 0 3px rgba(16, 163, 106, 0.22); }
        }
    }

    &__action-card-title {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 15px;
        font-weight: 700;
        color: $wpf-migrator-ink;
        letter-spacing: -0.005em;

        svg { flex-shrink: 0; }
    }

    &__action-card-desc {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: $wpf-migrator-muted;
        max-width: 56ch;
    }

    @media (max-width: 640px) {
        &__action-grid { grid-template-columns: 1fr; }
        &__action-card--span { grid-column: 1; }
    }

    &__badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: $wpf-migrator-radius-sm;
        font-size: 13px;
        font-weight: 600;

        &--success {
            background: $wpf-migrator-ok-soft;
            color: $wpf-migrator-ok;
            border: 1px solid $wpf-migrator-ok-line;
        }
    }

    &__hint {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: $wpf-migrator-line;
        color: $wpf-migrator-muted;
        font-size: 11px;
        font-weight: 700;
        cursor: help;
    }

    // -------------------------------------------------------------------------
    // Element UI overrides
    // -------------------------------------------------------------------------
    ::v-deep .el-table {
        font-size: 13px;
        border-radius: $wpf-migrator-radius-sm;
        overflow: hidden;
        border: 1px solid $wpf-migrator-line;

        th { background: #fafbfc !important; color: $wpf-migrator-muted; font-weight: 600; }
    }
}

@keyframes wpf-migrator-spin {
    to { transform: rotate(360deg); }
}

@keyframes wpf-migrator-pulse {
    0%, 80%, 100% { transform: scale(1);    opacity: 0.45; }
    40%           { transform: scale(1.4);  opacity: 1; }
}
</style>
