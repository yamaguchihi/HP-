// ==========================================
// 課題3 完成見本：コーポレートサイト
// 株式会社ネクストブリッジ
// ==========================================

// ------------------------------------------
// 1. ヘッダー：スクロールしたら影を付ける
// ------------------------------------------
const header = document.getElementById('header');

window.addEventListener('scroll', function () {
  header.classList.toggle('is-scrolled', window.scrollY > 50);
});

// ------------------------------------------
// 2. ハンバーガーメニュー
// ------------------------------------------
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

function closeMenu() {
  nav.classList.remove('is-open');
  menuBtn.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'メニューを開く');
}

menuBtn.addEventListener('click', function () {
  const isOpen = nav.classList.toggle('is-open');
  menuBtn.classList.toggle('is-open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

nav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', closeMenu);
});

// ------------------------------------------
// 3. ヒーロースライダー（自動再生・矢印・ドット）
// ------------------------------------------
const slides = document.querySelectorAll('.slider__item');
const dots = document.querySelectorAll('#sliderDots button');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
let currentIndex = 0;
let timerId = null;

// 指定した番号のスライドを表示する
function showSlide(index) {
  // 0〜(枚数-1) の範囲に収める（最後の次は最初へ、最初の前は最後へ）
  currentIndex = (index + slides.length) % slides.length;

  slides.forEach(function (slide, i) {
    slide.classList.toggle('is-active', i === currentIndex);
  });
  dots.forEach(function (dot, i) {
    dot.classList.toggle('is-active', i === currentIndex);
  });
}

// 5秒ごとに次のスライドへ
function startAutoPlay() {
  stopAutoPlay();
  timerId = setInterval(function () {
    showSlide(currentIndex + 1);
  }, 5000);
}

function stopAutoPlay() {
  clearInterval(timerId);
}

// 矢印・ドットを操作したら、タイマーをリセットして再スタート
nextBtn.addEventListener('click', function () {
  showSlide(currentIndex + 1);
  startAutoPlay();
});

prevBtn.addEventListener('click', function () {
  showSlide(currentIndex - 1);
  startAutoPlay();
});

dots.forEach(function (dot, i) {
  dot.addEventListener('click', function () {
    showSlide(i);
    startAutoPlay();
  });
});

startAutoPlay();

// ------------------------------------------
// 4. スクロールで表示（フェードイン）
// ------------------------------------------
const fadeItems = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      fadeObserver.unobserve(entry.target); // 一度表示したら監視をやめる
    }
  });
}, {
  rootMargin: '0px 0px -10% 0px' // 画面下端から10%入ったところで発火
});

fadeItems.forEach(function (item) {
  fadeObserver.observe(item);
});

// ------------------------------------------
// 5. 数字のカウントアップ
// ------------------------------------------
const counters = document.querySelectorAll('.count');

function countUp(element) {
  const target = Number(element.dataset.count);
  const duration = 1500; // 1.5秒かけて増やす
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // 最初は速く、最後ゆっくり（イージング）
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      countUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(function (counter) {
  countObserver.observe(counter);
});

// ------------------------------------------
// 6. 実績のタブ切り替え（絞り込み）
// ------------------------------------------
const tabButtons = document.querySelectorAll('#worksTabs button');
const worksItems = document.querySelectorAll('#worksList .works__item');

tabButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const filter = button.dataset.filter;

    // ボタンの見た目を切り替え
    tabButtons.forEach(function (b) {
      b.classList.toggle('is-active', b === button);
    });

    // 絞り込み
    worksItems.forEach(function (item) {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !match);
    });
  });
});

// ------------------------------------------
// 7. お問い合わせフォームの入力チェック＆送信
// ------------------------------------------
const form = document.getElementById('contactForm');
const thanks = document.getElementById('formThanks');

// 1つの項目をチェックして、エラーがあればメッセージを表示。OKなら true を返す
function validateField(field) {
  const row = field.closest('.form__row');
  const errorEl = row.querySelector('.form__error');
  const type = field.dataset.type || 'text';
  const isRequired = field.hasAttribute('data-required');
  let message = '';

  if (type === 'radio') {
    const checked = field.querySelector('input:checked');
    if (isRequired && !checked) message = 'お問い合わせ種別を選択してください';
  } else if (type === 'check') {
    if (isRequired && !field.checked) message = '同意にチェックを入れてください';
  } else {
    const value = field.value.trim();
    if (isRequired && value === '') {
      message = 'この項目は必須です';
    } else if (type === 'email' && value !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = 'メールアドレスの形式が正しくありません';
    } else if (type === 'tel' && value !== '' && !/^[0-9\-]+$/.test(value)) {
      message = '電話番号は半角数字とハイフンで入力してください';
    }
  }

  row.classList.toggle('is-error', message !== '');
  errorEl.textContent = message;
  return message === '';
}

const fields = form.querySelectorAll('[data-required], [data-type]');

// 送信時：全項目チェック
form.addEventListener('submit', function (event) {
  event.preventDefault(); // ページ遷移を止める

  let isValid = true;
  let firstErrorRow = null;

  fields.forEach(function (field) {
    const ok = validateField(field);
    if (!ok) {
      isValid = false;
      if (!firstErrorRow) firstErrorRow = field.closest('.form__row');
    }
  });

  if (!isValid) {
    // 最初のエラー項目までスクロール
    firstErrorRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // フォームの全項目データを取得
  const selectedType = form.querySelector('input[name="type"]:checked');

  const formData = {
    company: form.querySelector('#company') ? form.querySelector('#company').value : '',
    name: form.querySelector('#name').value,
    email: form.querySelector('#email').value,
    tel: form.querySelector('#tel') ? form.querySelector('#tel').value : '',
    type: selectedType ? selectedType.value : '未選択',
    message: form.querySelector('#message').value
  };

  fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.success) {
        // 送信成功時：フォームを非表示にして感謝メッセージを表示
        form.hidden = true;
        thanks.hidden = false;
        thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // サーバー側でエラーが発生した場合
        alert(data.message || '送信に失敗しました');
      }
    })
    .catch(function (error) {
      console.error('Error:', error);
      alert('通信エラーが発生しました。サーバーが起動しているか確認してください。');
    });
});

// 入力中：その項目だけ再チェック（エラーが消える）
fields.forEach(function (field) {
  const eventName = (field.dataset.type === 'radio' || field.dataset.type === 'check') ? 'change' : 'input';
  field.addEventListener(eventName, function () {
    if (field.closest('.form__row').classList.contains('is-error')) {
      validateField(field);
    }
  });
});

// ------------------------------------------
// 8. トップへ戻る
// ------------------------------------------
const totop = document.getElementById('totop');

window.addEventListener('scroll', function () {
  totop.classList.toggle('is-show', window.scrollY > 300);
});

totop.addEventListener('click', function (event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});