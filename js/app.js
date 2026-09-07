/* ==================================================
   法治赣鄱行 · 沉浸式法治宣传数字文创H5
   交互脚本 | 江西省高校暑期大思政实践活动作品
   ================================================== */

(function () {
    'use strict';

    // ---------------- 题库：3道江西法治主题闯关题 ----------------
    const QUIZ_DATA = [
        {
            tag: '红色法治',
            question: '1931年中华苏维埃共和国在江西哪里成立，并颁布了中国共产党领导下第一部红色宪法性文件？',
            options: ['A. 井冈山', 'B. 瑞金', 'C. 南昌', 'D. 兴国'],
            answer: 'B',
            explain: '正确答案：B. 瑞金。1931年11月7日，中华苏维埃第一次全国代表大会在江西瑞金召开，宣告中华苏维埃共和国成立，通过《中华苏维埃共和国宪法大纲》，这是中国共产党领导下第一部红色宪法性文件。'
        },
        {
            tag: '赣鄱法治渊源',
            question: '以下哪位江西籍历史人物主持了著名的"熙宁变法"，并提出"天变不足畏，祖宗不足法，人言不足恤"的法治革新精神？',
            options: ['A. 婺源朱熹', 'B. 修水陈宝箴', 'C. 临川王安石', 'D. 吉安欧阳修'],
            answer: 'C',
            explain: '正确答案：C. 临川王安石。北宋抚州临川（今江西抚州）人王安石主持熙宁变法，以"三不足"精神推行青苗法、保甲法等新法，其法治革新精神彪炳史册，被列宁誉为"中国十一世纪的改革家"。'
        },
        {
            tag: '新时代法治',
            question: '江西省首创培养农村基层法治骨干的工程名称是？',
            options: ['A. 法律明白人工程', 'B. 赣鄱法学工程', 'C. 法治村官工程', 'D. 井冈普法工程'],
            answer: 'A',
            explain: '正确答案：A. 法律明白人工程。江西省在全国率先实施农村"法律明白人"培养工程，截至2025年已培养35万余名法律明白人，实现行政村全覆盖，是江西法治建设的靓丽名片，入选全国基层法治宣传典型经验。'
        }
    ];

    // ---------------- 全局状态 ----------------
    const state = {
        quizIndex: 0,
        quizScore: 0,
        quizAnswered: false,
        signCount: 1286,
        dashboardAnimated: false
    };

    // ==================================================
    //   工具函数
    // ==================================================
    const $ = (id) => document.getElementById(id);
    const el = (sel, root = document) => root.querySelector(sel);
    const els = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    function formatCount(n) {
        return n.toLocaleString('en-US');
    }

    // ==================================================
    //   1. 加载动画
    // ==================================================
    function initLoader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = $('loader');
                const main = $('mainContent');
                if (loader) loader.classList.add('hidden');
                if (main) main.classList.add('visible');
            }, 1400);
        });
        // 兜底：3秒后强制显示
        setTimeout(() => {
            const loader = $('loader');
            const main = $('mainContent');
            if (loader && !loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
                main && main.classList.add('visible');
            }
        }, 3500);
    }

    // ==================================================
    //   2. 滚动系统：进度条 + 导航点 + 区块指示
    // ==================================================
    function initScrollSystem() {
        const sections = els('section.section');
        const progressFill = $('progressFill');
        const header = el('.header');
        const currentSpan = $('currentSection');
        const navDots = els('.nav-dot');

        function updateScroll() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            if (progressFill) progressFill.style.width = percent + '%';

            if (header) header.classList.toggle('scrolled', scrollTop > 50);

            // 找到当前激活的section
            let activeIdx = 0;
            const offset = window.innerHeight * 0.35;
            sections.forEach((sec, idx) => {
                if (scrollTop + offset >= sec.offsetTop) activeIdx = idx;
            });
            if (currentSpan) {
                currentSpan.textContent = String(activeIdx + 1).padStart(2, '0');
            }
            navDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIdx);
            });

            // 滚动到看板区块，触发数字动画
            const secNew = $('section-new');
            if (secNew && !state.dashboardAnimated) {
                const rect = secNew.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.75) {
                    animateDashboardStats();
                    state.dashboardAnimated = true;
                }
            }
        }

        window.addEventListener('scroll', updateScroll, { passive: true });
        window.addEventListener('resize', updateScroll);
        setTimeout(updateScroll, 100);

        // 导航点点击跳转
        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const target = $(dot.dataset.target);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 60,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==================================================
    //   3. 数据看板数字滚动动画
    // ==================================================
    function animateDashboardStats() {
        const statNums = els('.stat-num');
        statNums.forEach(numEl => {
            const target = parseInt(numEl.dataset.target || '0', 10);
            if (isNaN(target) || target <= 0) return;
            const duration = 1600;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
                const current = Math.round(target * eased);
                numEl.textContent = formatCount(current);
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    // ==================================================
    //   4. 法治知识闯关
    // ==================================================
    function initQuiz() {
        const quizCard = $('quizCard');
        const quizResult = $('quizResult');
        if (!quizCard) return;

        const qNumEl = $('quizQuestionNum');
        const qTagEl = $('quizQuestionTag');
        const qEl = $('quizQuestion');
        const optsEl = $('quizOptions');
        const feedbackEl = $('quizFeedback');
        const nextBtn = $('quizNextBtn');
        const currentEl = $('quizCurrent');
        const scoreEl = $('quizScore');
        const progressFill = $('quizProgressFill');

        function renderQuestion() {
            const data = QUIZ_DATA[state.quizIndex];
            qNumEl.textContent = `第 ${state.quizIndex + 1} 题 / 共 ${QUIZ_DATA.length} 题`;
            qTagEl.textContent = data.tag;
            qEl.textContent = data.question;

            optsEl.innerHTML = '';
            data.options.forEach(optText => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.dataset.answer = optText.charAt(0);
                btn.textContent = optText;
                optsEl.appendChild(btn);
            });

            state.quizAnswered = false;
            nextBtn.disabled = true;
            feedbackEl.className = 'quiz-feedback';
            feedbackEl.classList.remove('show', 'correct', 'wrong');
            feedbackEl.textContent = '';

            currentEl.textContent = `第 ${state.quizIndex + 1} 关`;
            scoreEl.textContent = `得分：${state.quizScore * 10}`;
            progressFill.style.width = `${((state.quizIndex) / QUIZ_DATA.length) * 100}%`;
        }

        function checkAnswer(btn) {
            if (state.quizAnswered) return;
            const chosen = btn.dataset.answer;
            const data = QUIZ_DATA[state.quizIndex];
            const options = els('.quiz-option', optsEl);

            state.quizAnswered = true;
            options.forEach(opt => { opt.disabled = true; opt.classList.remove('selected'); });

            if (chosen === data.answer) {
                btn.classList.add('correct');
                state.quizScore++;
                feedbackEl.className = 'quiz-feedback show correct';
                feedbackEl.innerHTML = `✅ 回答正确！+10分<br><span style="font-size:13px;opacity:0.85;">${data.explain}</span>`;
            } else {
                btn.classList.add('wrong');
                // 高亮正确答案
                options.forEach(opt => {
                    if (opt.dataset.answer === data.answer) opt.classList.add('correct');
                });
                feedbackEl.className = 'quiz-feedback show wrong';
                feedbackEl.innerHTML = `❌ 回答错误，正确答案是「${data.answer}」<br><span style="font-size:13px;opacity:0.85;">${data.explain}</span>`;
            }

            scoreEl.textContent = `得分：${state.quizScore * 10}`;
            nextBtn.disabled = false;
            nextBtn.textContent = state.quizIndex === QUIZ_DATA.length - 1 ? '查看结果 🎉' : '下一题 →';
        }

        function nextQuestion() {
            if (!state.quizAnswered) return;
            if (state.quizIndex < QUIZ_DATA.length - 1) {
                state.quizIndex++;
                renderQuestion();
            } else {
                showResult();
            }
        }

        function showResult() {
            progressFill.style.width = '100%';
            quizCard.style.display = 'none';
            quizResult.style.display = 'block';
            const score = state.quizScore;
            const total = QUIZ_DATA.length;
            const percent = score / total;

            $('resultScore').textContent = `${score} / ${total}`;
            $('quizCurrent').style.visibility = 'hidden';
            scoreEl.textContent = `最终得分：${score * 10}`;

            let title, badge, name, desc;
            if (percent === 1) {
                title = '完美通关！';
                badge = '🏆';
                name = '法治赣鄱金牌使者';
                desc = '你以满分成绩完成闯关！你对江西法治文化、红色法治基因和新时代法治实践了如指掌，当之无愧的法治赣鄱金牌宣传员！';
            } else if (percent >= 0.66) {
                title = '恭喜通关！';
                badge = '🎖';
                name = '法治赣鄱使者';
                desc = '你已圆满完成法治知识闯关，彰显了新时代江西青年的法治素养！继续努力，让法治之光照亮赣鄱大地！';
            } else {
                title = '闯关完成！';
                badge = '💪';
                name = '法治赣鄱学习使者';
                desc = '感谢你的参与！通过这次闯关，相信你对江西法治文化有了更多了解。再闯一次，让法治知识更加入脑入心！';
            }
            $('resultTitle').textContent = title;
            $('resultBadge').textContent = badge;
            $('resultTitleName').textContent = name;
            $('resultDesc').textContent = desc;

            // 重新触发徽章动画
            const elB = $('resultBadge');
            elB.style.animation = 'none';
            void elB.offsetWidth;
            elB.style.animation = '';
        }

        function retake() {
            state.quizIndex = 0;
            state.quizScore = 0;
            quizResult.style.display = 'none';
            quizCard.style.display = 'block';
            $('quizCurrent').style.visibility = 'visible';
            renderQuestion();
            window.scrollTo({
                top: $('section-quiz').offsetTop - 70,
                behavior: 'smooth'
            });
        }

        optsEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('quiz-option')) checkAnswer(e.target);
        });
        nextBtn && nextBtn.addEventListener('click', nextQuestion);
        $('btnRetake') && $('btnRetake').addEventListener('click', retake);

        renderQuestion();
    }

    // ==================================================
    //   5. 青年签名承诺墙
    // ==================================================
    function initSignWall() {
        const btnSign = $('btnSign');
        const inputSign = $('signName');
        const signsContainer = $('signsContainer');
        const signCountEl = el('#signCount strong');
        if (!btnSign || !inputSign) return;

        function addSign(name) {
            if (!signsContainer) return;
            const tag = document.createElement('span');
            tag.className = 'sign-tag new';
            tag.textContent = name.trim();
            // 随机插入在前30%位置，避免总在最后看不见
            const children = signsContainer.children;
            if (children.length > 0 && Math.random() > 0.4) {
                const idx = Math.floor(Math.random() * Math.min(6, children.length));
                signsContainer.insertBefore(tag, children[idx]);
            } else {
                signsContainer.appendChild(tag);
            }
            state.signCount++;
            if (signCountEl) signCountEl.textContent = formatCount(state.signCount);
            // 1s后移除new标记（保留样式即可）
            setTimeout(() => tag.classList.remove('new'), 2200);
        }

        function doSign() {
            const name = inputSign.value.trim();
            if (name.length === 0) {
                inputSign.focus();
                inputSign.style.borderColor = '#e53935';
                inputSign.placeholder = '⚠ 请先输入你的名字哦~';
                setTimeout(() => {
                    inputSign.style.borderColor = '';
                    inputSign.placeholder = '请输入你的姓名（高校学子）';
                }, 1800);
                return;
            }
            if (name.length > 20) {
                alert('名字太长啦，请控制在20字以内~');
                return;
            }
            addSign(name);
            inputSign.value = '';
            inputSign.blur();
            // 简单反馈：按钮变色 + 小提示
            btnSign.textContent = '承诺成功 ✓';
            btnSign.style.background = 'linear-gradient(135deg, #2e7d32, #1b5e20)';
            setTimeout(() => {
                btnSign.textContent = '我承诺 ⚖';
                btnSign.style.background = '';
            }, 1600);
        }

        btnSign.addEventListener('click', doSign);
        inputSign.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doSign();
        });
    }

    // ==================================================
    //   6. 设计说明字数统计
    // ==================================================
    function initWordCounter() {
        const text = $('designText');
        const counter = $('wordCount');
        if (!text || !counter) return;
        // 中文字符 + 英文单词合计
        const str = text.innerText || '';
        const cnCount = (str.match(/[\u4e00-\u9fa5]/g) || []).length;
        const enCount = (str.match(/[A-Za-z]+/g) || []).length;
        const total = cnCount + enCount;
        counter.textContent = total;
        // 若超过500字红色提示
        if (total > 500) {
            counter.style.color = '#c62828';
        }
    }

    // ==================================================
    //   7. 滚动渐显动画（fade-in）
    // ==================================================
    function initFadeIn() {
        const targets = els('.timeline-card, .red-card, .stat-card, .case-card, .highlight-item, .heritage-node, .pledge-card, .quiz-card');
        targets.forEach(t => {
            t.classList.add('fade-in');
            // 加一个轻微的延迟错开
            const delay = Math.floor(Math.random() * 120);
            t.style.transitionDelay = delay + 'ms';
        });

        const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 }) : null;

        if (io) {
            targets.forEach(t => io.observe(t));
        } else {
            // 退化：直接显示
            targets.forEach(t => t.classList.add('visible'));
        }
    }

    // ==================================================
    //   8. 控制台彩蛋（版权说明）
    // ==================================================
    function initConsoleBranding() {
        try {
            const main = [
                '%c ⚖ 法治赣鄱行 %c 沉浸式法治宣传数字文创H5作品 ',
                'background:linear-gradient(90deg,#8b1a1a,#c9a96a);color:#fff;padding:6px 14px;font-weight:bold;border-radius:4px 0 0 4px;font-size:13px;',
                'background:#1a3a5c;color:#c9a96a;padding:6px 14px;font-weight:bold;border-radius:0 4px 4px 0;font-size:13px;'
            ];
            console.log(...main);
            console.log('%c2026 江西省高校暑期大思政实践活动 · 数字文创参赛作品', 'color:#5a6a7a;font-size:11px;');
            console.log('%c作品主题：牢记嘱托强国有我 · 行走赣鄱感恩奋进', 'color:#8b1a1a;font-size:11px;');
        } catch (e) { /* ignore */ }
    }

    // ==================================================
    //   启动
    // ==================================================
    function bootstrap() {
        initLoader();
        initScrollSystem();
        initQuiz();
        initSignWall();
        initWordCounter();
        initFadeIn();
        initConsoleBranding();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
