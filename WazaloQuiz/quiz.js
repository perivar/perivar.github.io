jQuery(document)
	.ready(function($) {
		function detectIE() {
			var e = window.navigator.userAgent,
				i = e.indexOf("MSIE ");
			if (i > 0) return !0;
			var s = e.indexOf("Trident/");
			return s > 0 ? !0 : !1
		}

		function ieFix(e) {
			$(e)
				.find("#fca_qc_back_container")
				.css("backface-visibility", "visible"), $(e)
				.find("#fca_qc_back_container")
				.css("transform", "none"), $(e)
				.find("#fca_qc_back_container")
				.hide()
		}

		function loadQuizzes() {
			$(".fca_qc_quiz")
				.each(function(index) {
					var thisId = get_quiz_id(this);
					thisId && (quizzes[thisId] = eval("quizData_" + thisId), quizzes[thisId].selector = this, default_img = quizzes[thisId].default_img)
				}), $.each(quizzes, function(e) {
					$.each(quizzes[e].questions, function(i) {
						quizzes[e].questions[i].answers = quizzes[e].questions[i].answers.filter(function(e) {
							return "" !== e.answer || "" !== e.img
						}), quizzes[e].questions[i].hasOwnProperty("answers") && 0 !== quizzes[e].questions[i].answers.length || quizzes[e].questions.splice(i)
					})
				}), $.each(quizzes, function(e) {
					"on" == quizzes[e].quiz_settings.shuffle_questions && (quizzes[e].questions = shuffleArray(quizzes[e].questions))
				})
		}

		function preloadImages() {
			$.each(quizzes, function(e) {
				quizzes[e].questions[0] && lazyLoadQuestion(quizzes[e].questions[0])
			})
		}

		function lazyLoadResults(e) {
			e.hasOwnProperty("quiz_results") && $.each(e.quiz_results, function(i) {
				e.quiz_results[i].hasOwnProperty("img") && lazyLoadImage(e.quiz_results[i].img)
			})
		}

		function lazyLoadImage(e) {
			if ("" !== e && void 0 !== e && "string" == typeof e) {
				var i = new Image;
				i.src = e
			}
		}

		function lazyLoadQuestion(e) {
			e.hasOwnProperty("img") && lazyLoadImage(e.img), e.hasOwnProperty("answers") && $.each(e.answers, function(i) {
				e.answers[i].hasOwnProperty("img") && lazyLoadImage(e.answers[i].img)
			})
		}

		function get_quiz_id(e) {
			var i = $(e)
				.attr("id");
			return i ? i.replace(/\D+/g, "") : !1
		}

		function showQuestion(e) {
			if (e.currentQuestion < e.questionCount) {
				$(e.selector)
					.find(".fca_qc_question_count")
					.html(e.currentQuestion + 1 + "/" + e.questionCount);
				var i = e.questions[e.currentQuestion].question;
				$(e.selector)
					.find("#fca_qc_question")
					.html(i), $(e.selector)
					.find("#fca_qc_question_back")
					.html(i);
				var s = e.questions[e.currentQuestion].img;
				$(e.selector)
					.find("#fca_qc_answer_container")
					.find(".fca_qc_quiz_question_img")
					.attr("src", s), $(e.selector)
					.find("#fca_qc_back_container")
					.find(".fca_qc_quiz_question_img")
					.attr("src", s), $(e.selector)
					.find("#fca_qc_answer_container")
					.data("id", e.questions[e.currentQuestion].id);
				var t;
				"mc" == e.quiz_settings.quiz_type && (t = e.questions[e.currentQuestion].answers[0]);
				var n = shuffleArray(e.questions[e.currentQuestion].answers);
				e.currentQuestion + 1 < e.questionCount ? lazyLoadQuestion(e.questions[e.currentQuestion + 1]) : lazyLoadResults(e), $(e.selector)
					.find(".fca_qc_answer_div")
					.hide();
				for (var c = 0; c < n.length; c++)("" !== n[c].img || "" !== n[c].answer) && ("mc" == e.quiz_settings.quiz_type && n[c].answer == t.answer && n[c].img == t.img && (e.currentAnswer = $(e.selector)
						.find(".fca_qc_answer_div")
						.eq(c)
						.attr("data-question")), "pt" == e.quiz_settings.quiz_type && $(e.selector)
					.find(".fca_qc_answer_div")
					.eq(c)
					.data("results", n[c].results), $(e.selector)
					.find(".fca_qc_answer_div")
					.eq(c)
					.find(".fca_qc_quiz_answer_img")
					.attr("src", n[c].img), $(e.selector)
					.find(".fca_qc_answer_div")
					.eq(c)
					.find(".fca_qc_answer_span")
					.html(svg_square + n[c].answer), $(e.selector)
					.find(".fca_qc_answer_div")
					.eq(c)
					.data("id", n[c].id), $(e.selector)
					.find(".fca_qc_answer_div")
					.eq(c)
					.show());
				$(e.selector)
					.find("#fca_qc_answer_container")
					.waitForImages(function() {
						maybe_add_quarter_class(e.selector), scale_flip_box_question(e.selector)
					}), e.currentQuestion = e.currentQuestion + 1
			} else endTest(e)
		}

		function maxHeightOfElementSet(e) {
			var i = 0;
			return $.each(e, function(s) {
				e.eq(s)
					.outerHeight() > i && (i = e.eq(s)
						.outerHeight())
			}), i
		}

		function scale_flip_box_question(e) {
			var i = $(e)
				.find("#fca_qc_question")
				.outerHeight(!0);
			i += $(e)
				.find(".fca_qc_quiz_question_img")
				.outerHeight(!0);
			var s = 0,
				t = 0;
			$(e)
				.find(".fca_qc_answer_div:visible")
				.eq(0)
				.hasClass("fca-qc-twoup") ? (t = maxHeightOfElementSet($(e)
						.find(".fca_qc_answer_div:visible")), s = $(e)
					.find(".fca_qc_answer_div:visible")
					.length, s = Math.floor(s / 2) + s % 2, i += t * s) : $(e)
				.find(".fca_qc_answer_div:visible")
				.eq(0)
				.hasClass("fca-qc-threeup") ? (t = maxHeightOfElementSet($(e)
						.find(".fca_qc_answer_div:visible")), s = $(e)
					.find(".fca_qc_answer_div:visible")
					.length, s /= 3, i += t * s) : $(e)
				.find(".fca_qc_answer_div:visible")
				.each(function() {
					i += $(this)
						.outerHeight(!0)
				}), 200 > i && (i = 200), $(e)
				.find(".fca_qc_quiz_div, #fca_qc_answer_container, #fca_qc_back_container")
				.outerHeight(i)
		}

		function scale_flip_box_back(e) {
			var i = 0;
			$(e)
				.find("#fca_qc_back_container")
				.children()
				.each(function() {
					$(this)
						.is(":visible") && (i += $(this)
							.outerHeight(!0))
				}), i += 35, 400 > i && (i = 400), $(e)
				.find(".fca_qc_quiz_div, #fca_qc_answer_container, #fca_qc_back_container")
				.height(i)
		}

		function maybe_add_quarter_class(e) {
			$(e)
				.find(".fca_qc_answer_div")
				.height("auto"), $(e)
				.find(".fca_qc_answer_div")
				.removeClass("fca-qc-twoup fca-qc-threeup"), $(e)
				.find(".fca_qc_quiz_answer_img")
				.css("marginBottom", 0);
			var i = !0,
				s = 0;
			if ($(e)
				.find(".fca_qc_answer_div:visible")
				.each(function() {
					return s++, "" !== $(this)
						.find(".fca_qc_quiz_answer_img")
						.attr("src") && i ? void 0 : (i = !1, !1)
				}), i) {
				var t = "fca-qc-twoup";
				s % 3 === 0 && 0 === $(e)
					.find(".fca_qc_mobile_check:visible")
					.length && (t = "fca-qc-threeup"), $(e)
					.find(".fca_qc_answer_div")
					.addClass(t);
				var n = maxHeightOfElementSet($(e)
					.find(".fca_qc_quiz_answer_img:visible"));
				n > 200 && (n = 200), $(e)
					.find(".fca_qc_quiz_answer_img:visible")
					.each(function() {
						$(this)
							.css("marginBottom", n - $(this)
								.height() + 10 + "px")
					});
				var c = maxHeightOfElementSet($(e)
					.find(".fca_qc_answer_div:visible"));
				return $(e)
					.find(".fca_qc_answer_div:visible")
					.outerHeight(c), !0
			}
			return !1
		}

		function set_result(e) {
			var i = "undefined";
			if ("pt" == e.quiz_settings.quiz_type) {
				var s = -1,
					t = [];
				$.each(e.quiz_results, function(e, i) {
						i.hasOwnProperty("score") && i.score > s && (s = i.score)
					}), $.each(e.quiz_results, function(e, i) {
						i.hasOwnProperty("score") && i.score == s && t.push(i)
					}), 0 === t.length && (t = e.quiz_results), $(e.selector)
					.find(".fca_qc_score_text")
					.hide(), i = t[Math.floor(Math.random() * t.length)]
			} else {
				for (var n = 0;
					"undefined" == i;) e.quiz_results[n].min <= e.score && e.quiz_results[n].max >= e.score ? i = e.quiz_results[n] : n == e.quiz_results.length ? i = "error" : n++;
				var c = scoreString.replace("{{SCORE_CORRECT}}", e.score);
				c = c.replace("{{SCORE_TOTAL}}", e.questionCount), $(e.selector)
					.find(".fca_qc_score_text")
					.html(c)
			}
			return $(e.selector)
				.find(".fca_qc_score_title")
				.html(i.title), $(e.selector)
				.find(".fca_qc_score_img")
				.attr("src", i.img), $(e.selector)
				.find(".fca_qc_score_desc")
				.html(i.desc), i.hasOwnProperty("id") ? add_result(e.ajaxurl, e.nonce, e.quiz_id, i.id) : add_result(e.ajaxurl, e.nonce, e.quiz_id, e.score), "pt" == e.quiz_settings.quiz_type ? i.title : i.title ? e.score + "/" + e.questionCount + ": " + i.title : e.score + "/" + e.questionCount
		}

		function show_responses(e) {
			for (var i, s = 0; s < e.questions.length; s++) i = "", i += e.responses[s].isCorrect ? "<div class='fca_qc_question_response_item correct-answer'>" : "<div class='fca_qc_question_response_item wrong-answer'>", i += "<h3 class='fca_qc_question_response_question'>" + (s + 1) + ". " + e.questions[s].question + "</h3>", i += "<img class='fca_qc_quiz_question_img' src='" + e.questions[s].img + "'>", i += "<p class='fca_qc_question_response_response'><span class='fca_qc_bold'>" + e.your_answer_string + " </span>" + e.responses[s].answer + "</p>", i += "<p class='fca_qc_question_response_correct_answer'><span class='fca_qc_bold'>" + e.correct_answer_string + " </span>" + e.responses[s].correctAnswer + "</p>", i += "</div>", $(e.selector)
				.find(".fca_qc_insert_response_above")
				.before(i);
			$(e.selector)
				.find(".fca_qc_your_answer_container")
				.show()
		}

		function endTest(e) {
			add_activity(e.ajaxurl, e.nonce, e.quiz_id, "completions"), $(e.selector)
				.find(".fca_qc_quiz_footer")
				.hide(), $(e.selector)
				.find(".fca_qc_quiz_div")
				.hide(), "on" == e.optin_settings.capture_emails ? show_optins(e) : show_sharing_and_result_screen(e, set_result(e))
		}

		function show_optins(e) {
			var i = set_result(e);
			$(e.selector)
				.find(".fca_qc_optin_input")
				.tooltipster({
					trigger: "custom",
					maxWidth: 240,
					theme: ["tooltipster-borderless", "tooltipster-quiz-cat"]
				})
				.tooltipster("close"), $(e.selector)
				.find(".fca_qc_optin_container")
				.show(), $(e.selector)
				.find(".fca_qc_optin_input")
				.first()
				.focus(), $(e.selector)
				.find(".fca_qc_skip_email_button")
				.click(function() {
					$(e.selector)
						.find(".fca_qc_optin_container")
						.hide(), $(e.selector)
						.find(".fca_qc_optin_input")
						.tooltipster("close"), show_sharing_and_result_screen(e, i)
				}), $(e.selector)
				.find(".fca_qc_submit_email_button")
				.click(function() {
					var s = $(e.selector)
						.find("#fca_qc_email_input")
						.val(),
						t = $(e.selector)
						.find("#fca_qc_name_input")
						.val(),
						n = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
						c = n.test(s),
						r = "" !== t || 0 === $(e.selector)
						.find("#fca_qc_name_input")
						.length;
					$(e.selector)
						.find(".fca_qc_optin_input")
						.removeClass("fca_qc_invalid"), e.selector.offsetWidth = e.selector.offsetWidth, c && r ? ($(document)
							.unbind("keypress"), $(e.selector)
							.find(".fca_qc_optin_input")
							.tooltipster("close"), e.user = {
								name: t,
								email: s
							}, add_to_mailing_list(e.ajaxurl, e.quiz_id, e.nonce, s, t, i), $(e.selector)
							.find(".fca_qc_optin_container")
							.hide(), show_sharing_and_result_screen(e, i)) : (c ? ($(e.selector)
							.find("#fca_qc_email_input")
							.tooltipster("close"), $(e.selector)
							.find("#fca_qc_email_input")
							.removeClass("fca_qc_invalid")) : ($(e.selector)
							.find("#fca_qc_email_input")
							.tooltipster("open"), $(e.selector)
							.find("#fca_qc_email_input")
							.addClass("fca_qc_invalid")), r ? ($(e.selector)
							.find("#fca_qc_name_input")
							.tooltipster("close"), $(e.selector)
							.find("#fca_qc_name_input")
							.removeClass("fca_qc_invalid")) : ($(e.selector)
							.find("#fca_qc_name_input")
							.tooltipster("open"), $(e.selector)
							.find("#fca_qc_name_input")
							.addClass("fca_qc_invalid")))
				}), 0 === $(e.selector)
				.find(".fca_qc_skip_email_button")
				.length && 0 === $(e.selector)
				.find(".fca_qc_submit_email_button")
				.length ? show_sharing_and_result_screen(e, i) : $(document)
				.keypress(function(i) {
					return 13 == i.which ? ($(e.selector)
						.find(".fca_qc_submit_email_button")
						.click(), !1) : void 0
				})
		}

		function add_to_mailing_list(e, i, s, t, n, c) {
			return -1 !== optins.indexOf(i) ? (console.log("already opted in for this quiz! woop"), !1) : (optins.push(i), void $.ajax({
					url: e,
					type: "POST",
					data: {
						action: "fca_qc_add_to_mailing_list",
						nonce: s,
						post_id: i,
						email: t,
						name: n,
						result: c
					}
				})
				.done(function(e) {
					console.log(e)
				}))
		}

		function add_activity(e, i, s, t) {
			if ("shares" == t) {
				if (-1 !== shared.indexOf(s)) return console.log("already shared this quiz! woop"), !1;
				shared.push(s)
			} else if ("completions" == t) {
				if (-1 !== completed.indexOf(s)) return console.log("already completed this quiz! woop"), !1;
				completed.push(s)
			}
			$.ajax({
					url: e,
					type: "POST",
					data: {
						action: "fca_qc_activity",
						nonce: i,
						quiz_id: s,
						type: t
					}
				})
				.done(function(e) {
					console.log(e)
				})
		}

		function add_result(e, i, s, t) {
			return -1 !== results.indexOf(s) ? (console.log("already stored results for this quiz! woop"), !1) : (results.push(s), void $.ajax({
					url: e,
					type: "POST",
					data: {
						action: "fca_qc_add_result_ajax",
						nonce: i,
						quiz_id: s,
						result: t
					}
				})
				.done(function(e) {
					console.log(e)
				}))
		}

		function add_response(e, i, s, t, n) {
			$.ajax({
					url: e,
					type: "POST",
					data: {
						action: "fca_qc_add_response_ajax",
						nonce: i,
						quiz_id: s,
						question: t,
						response: n
					}
				})
				.done(function(e) {
					console.log(e)
				})
		}

		function send_responses(e, i) {
			var s = "",
				t = "";
			e.hasOwnProperty("user") && (s = e.user.name, t = e.user.email), $.ajax({
					url: e.ajaxurl,
					type: "POST",
					data: {
						action: "fca_qc_send_responses_ajax",
						nonce: e.nonce,
						quiz_id: e.quiz_id,
						name: s,
						email: t,
						result: i,
						responses: e.responses
					}
				})
				.done(function(e) {
					console.log(e)
				})
		}

		function restart_quiz() {
			location.reload()
		}

		function show_sharing_and_result_screen(e, i) {
			send_responses(e, i), $(e.selector)
				.find(".fca_qc_score_container")
				.show(), "on" == e.quiz_settings.restart_button && $("#fca_qc_restart_button")
				.click(function() {
					restart_quiz(e), $(this)
						.hide()
				})
				.show("fast"), "end" == e.hideAnswers && show_responses(e), "on" == e.quiz_settings.show_sharing && show_sharing(e, i)
		}

		function get_correct_answer_html(e) {
			var i = "",
				s = "";
			return $(e.selector)
				.find(".fca_qc_answer_div")
				.each(function() {
					$(this)
						.attr("data-question") == e.currentAnswer && (i = addQuizImg($(this)
								.find(".fca_qc_quiz_answer_img")
								.attr("src")), s = $(this)
							.find(".fca_qc_answer_span")
							.html()
							.replace(svg_square, ""))
				}), i + s
		}

		function show_sharing(e, i) {
			$(e.selector)
				.find(".fca_qc_social_share")
				.show("fast");
			var s = $(e.selector)
				.find(".fca_qc_score_img")
				.attr("src");
			"" === s && (s = $(e.selector)
				.find(".fca_qc_quiz_description_img")
				.attr("src")), "" === s && (s = default_img);
			var t = $(e.selector)
				.find("#fca_qc_share_link_facebook");
			1 == t.length && (encode_share_link(t, i), t.prop("href", t.prop("href") + "&picture=" + s));
			var n = $(e.selector)
				.find("#fca_qc_share_link_twitter");
			1 == n.length && encode_share_link(n, i);
			var c = $(e.selector)
				.find("#fca_qc_share_link_email");
			1 == c.length && encode_share_link(c, i);
			var r = $(e.selector)
				.find("#fca_qc_share_link_pinterest");
			1 == r.length && (encode_share_link(r, i), r.prop("href", r.prop("href") + "&media=" + s)), $(e.selector)
				.find(".fca_qc_share_link")
				.click(function(i) {
					i.preventDefault();
					var s = $(this)
						.prop("href");
					window.open(s, "_blank", "resizable=yes,scrollbars=yes,titlebar=yes, width=560, height=443, top=100, left=50"), add_activity(e.ajaxurl, e.nonce, e.quiz_id, "shares")
				})
		}

		function encode_share_link(e, i) {
			var s = encodeURIComponent(e.data("sharestring")
					.replace("{{MY_QUIZ_RESULT}}", i)),
				t = e.prop("href");
			e.prop("href", t + s)
		}

		function shuffleArray(e) {
			for (var i = e.length - 1; i > 0; i--) {
				var s = Math.floor(Math.random() * (i + 1)),
					t = e[i];
				e[i] = e[s], e[s] = t
			}
			return e
		}

		function addQuizImg(e) {
			return e && "" !== e && "string" == typeof e ? "<img class='fca_qc_quiz_answer_img' src='" + e + "'>" : ""
		}

		function scrollQuizInToView(e) {
			var i = $(e)
				.offset()
				.top;
			0 > i && (i = 0), $("html, body")
				.animate({
					scrollTop: i
				}, 300)
		}

		function debounce(e, i, s) {
			var t;
			return function() {
				var n = this,
					c = arguments,
					r = function() {
						t = null, s || e.apply(n, c)
					},
					a = s && !t;
				clearTimeout(t), t = setTimeout(r, i), a && e.apply(n, c)
			}
		}
		var usingIE = detectIE(),
			scoreString = $(".fca_qc_score_text")
			.first()
			.html(),
			svg_square = '<svg class="fca_qc_rectancle" width="26" height="26"><rect width="26" height="26" style="fill:#fff;stroke-width:1;stroke:#000;"></rect></svg>',
			quizzes = {},
			default_img = "";
		loadQuizzes(), preloadImages(), $(".fca_qc_start_button")
			.click(function() {
				var e = quizzes[get_quiz_id($(this)
					.closest(".fca_qc_quiz"))];
				add_activity(e.ajaxurl, e.nonce, e.quiz_id, "starts"), usingIE && ieFix(e.selector), e.currentQuestion = 0, e.score = 0, e.responses = [], e.questionCount = e.questions.length, e.hideAnswers = "" === e.quiz_settings.hide_answers ? "after" : "on" === e.quiz_settings.hide_answers ? "end" : e.quiz_settings.hide_answers, $(this)
					.siblings(".fca_qc_quiz_title")
					.hide(), $(this)
					.siblings(".fca_qc_quiz_description")
					.hide(), $(this)
					.siblings(".fca_qc_quiz_description_img")
					.hide(), $(this)
					.hide(), $(this)
					.siblings(".fca_qc_quiz_div")
					.show(), $(this)
					.siblings(".fca_qc_quiz_footer")
					.show(), $(this)
					.siblings(".flip-container")
					.show(), $(this)
					.siblings(".fca_qc_question_count")
					.html("1/" + e.questionCount), showQuestion(e), scrollQuizInToView(e.selector)
			}), $(".fca_qc_next_question")
			.click(function() {
				var e = quizzes[get_quiz_id($(this)
					.closest(".fca_qc_quiz"))];
				usingIE ? ($(e.selector)
						.find("#fca_qc_answer_container")
						.show(), $(e.selector)
						.find("#fca_qc_back_container")
						.hide()) : $(e.selector)
					.find(".fca_qc_quiz_div")
					.removeClass("flip"), showQuestion(e)
			}), $(".fca_qc_answer_div")
			.click(function() {
				var e = quizzes[get_quiz_id($(this)
					.closest(".fca_qc_quiz"))];
				scrollQuizInToView(e.selector), $(this)
					.blur();
				var i = $(this)
					.closest("#fca_qc_answer_container")
					.data("id"),
					s = $(this)
					.data("id"),
					t = !1;
				$(this)
					.attr("data-question") === e.currentAnswer && (e.score = e.score + 1, t = !0);
				var n = {
					answer: addQuizImg($(this)
							.children(".fca_qc_quiz_answer_img")
							.attr("src")) + $(this)
						.children(".fca_qc_answer_span")
						.html()
						.replace(svg_square, ""),
					isCorrect: t,
					correctAnswer: get_correct_answer_html(e),
					question: $(this)
						.siblings("#fca_qc_question")
						.html()
				};
				if (e.responses.push(n), add_response(e.ajaxurl, e.nonce, e.quiz_id, i, s), "pt" == e.quiz_settings.quiz_type) $.each($(this)
					.data("results"),
					function(i, s) {
						$.each(e.quiz_results, function(e, i) {
							s == i.id && (i.score = i.hasOwnProperty("score") ? i.score + 1 : 1)
						})
					}), showQuestion(e);
				else if ("after" == e.hideAnswers) {
					$(e.selector)
						.find("#fca_qc_your_answer")
						.html(addQuizImg($(this)
								.children(".fca_qc_quiz_answer_img")
								.attr("src")) + $(this)
							.children(".fca_qc_answer_span")
							.html()
							.replace(svg_square, ""));
					var c = get_correct_answer_html(e);
					$(e.selector)
						.find("#fca_qc_correct_answer")
						.html(c), usingIE ? ($(e.selector)
							.find("#fca_qc_answer_container")
							.hide(), $(e.selector)
							.find("#fca_qc_back_container")
							.show()) : $(e.selector)
						.find(".fca_qc_quiz_div")
						.addClass("flip"), $(e.selector)
						.find("#fca_qc_back_container")
						.removeClass("correct-answer"), $(e.selector)
						.find("#fca_qc_back_container")
						.removeClass("wrong-answer"), t ? ($(e.selector)
							.find("#fca_qc_back_container")
							.addClass("correct-answer"), $(e.selector)
							.find("#fca_qc_question_right_or_wrong")
							.html(e.correct_string), $(e.selector)
							.find("#fca_qc_correct_answer_p")
							.hide()) : ($(e.selector)
							.find("#fca_qc_back_container")
							.addClass("wrong-answer"), $(e.selector)
							.find("#fca_qc_question_right_or_wrong")
							.html(e.wrong_string), $(e.selector)
							.find("#fca_qc_correct_answer_p")
							.show()), scale_flip_box_back(e.selector)
				} else showQuestion(e)
			});
		var optins = [],
			shared = [],
			completed = [],
			results = [],
			resizeWindow = debounce(function() {
				jQuery.each(quizzes, function(e) {
					$(quizzes[e].selector)
						.find("#fca_qc_answer_container")
						.waitForImages(function() {
							maybe_add_quarter_class(quizzes[e].selector), scale_flip_box_question(quizzes[e].selector)
						})
				})
			}, 50);
		window.addEventListener("resize", resizeWindow)
	});