window.addEventListener('load', () => ReplaceFavoriteApp.init());

const ReplaceFavoriteApp = {
	init: () => {
		const construct = setInterval(() => {
			if (typeof window.SFA == 'undefined') return;
			clearInterval(construct);

			if (window.SFA.setting != 'on') return;
			
			ReplaceFavoriteApp.replace();

			const colmun = document.createElement('div');
			colmun.setAttribute('class', 'grid grid--uniform grid--collection');
			const MAX = window.SFA.count;
			const setting = {
				items: SFA.cookie.fav_items.slice(0, MAX),
				pages: Math.ceil(SFA.cookie.fav_items.length / MAX),
				paged: 1
			}
			if (setting.items.length == 0) {
                colmun.style.textAlign = 'center';
				const svgStyle = (scale = 0, bool = false) => {
                    const icon = bool? ['ph:heart-straight-thin.svg', 'iwwa:star-o.svg', 'ph:bookmark-simple-thin.svg']: SFA.creat.icon;
                    return `background: ${window.SFA.css.icon_color};display: inline-block;height: ${scale};margin: 2px 0 -2px;-webkit-mask-image: url('//api.iconify.design/${icon[window.SFA.css.icons]}');-webkit-mask-position: center;-webkit-mask-repeat: no-repeat;-webkit-mask-size: contain;mask-image: url('//api.iconify.design/${icon[window.SFA.css.icons]}');mask-position: center;mask-repeat: no-repeat;mask-size: contain;width: ${scale};`;
                }
				const i = document.createElement('i');
				i.style.cssText = svgStyle('100px', true);
                colmun.appendChild(i);

				const msg = SFA.creat.element('p');
                msg.appendChild(SFA.creat.element('i', {'style.cssText': svgStyle('1em', true)}));
                msg.innerHTML = `Click the ${msg.innerHTML} button to add the items to your favorite list.`;
                msg.style.margin = '30px 20px 20px';
                colmun.appendChild(msg);

				const a = SFA.creat.element('a', {href: '/', innerText: 'CONTINUE SHOPPING'});
                a.style.cssText = `background: #111;color: #fff;display: inline-block;line-height: 1;margin: 0 0 80px;padding: 10px 20px;text-decoration: none;`;
				colmun.appendChild(a);
				
				document.querySelector('#ReplaceFavoriteApp').appendChild(colmun);
                return;
			}

			setting.items = [...new Set(setting.items.map(item => item = decodeURI(item)))];
			setting.items.map(async item => {
				const product = await (await (await fetch(`/products/${item}.js`)).json());
				const meta    = await (await (await fetch(`/products/${item}?view=series`)).text()).split('|');
                colmun.appendChild(SFA.creat.list(product, meta))
			});

            document.querySelector('#ReplaceFavoriteApp').appendChild(colmun);
            document.querySelector('#ReplaceFavoriteApp').appendChild(SFA.creat.pager(setting));

			const s = document.createElement('style');
			s.innerHTML = '.SFA__btn__list{right: 15%;}';
			document.head.appendChild(s);
		}, 100);
	},

	replace: () => SFA.creat.list = (item, meta = []) => {
		const media = typeof item.media !== 'undefined'? item.media[0]: {
			aspect_ratio: 1,
			src: `//cdn.shopify.com/s/files/1/0268/1202/2962/t/41/assets/boost-pfs-no-image_360x.gif?v=4551082043989976841`,
			preview_image: {
				alt: ''
			}
		};
		const price = () => {
			const v   = item.variants.map(r => r.price);
			const min = v.reduce((a, b) => Math.min(a, b)) / 100;
			const max = v.reduce((a, b) => Math.max(a, b)) / 100;
			return `¥${min.toLocaleString()}${max > min? ' 〜 ': ''}${max > min? max.toLocaleString() : ''}`;
		}
		const container = document.createElement('div');
		container.setAttribute('class', 'grid__item grid-product small--one-half medium-up--one-third');
		container.style.position = 'relative';
		container.innerHTML = `
		<div class="grid-product__content">
			<a href="${item.url}" class="grid-product__link" style="display: block">
				<div class="grid-product__image-mask">
					<div class="image-wrap" style="height: 0; padding-bottom: ${Math.floor(100 / media.aspect_ratio)}%;">
						<img class="grid-product__image lazyload"
							data-src="${media.src}"
							data-widths="[180, 360, 540, 720, 900, 1080]"
							data-aspectratio="${media.aspect_ratio}"
							data-sizes="auto" alt="${media.preview_image.alt}">    
					</div>
				</div>
				<div class="custom-field--value product-series">
					<span class="series-name">${meta[0]}</span> | <span class="style-name">${meta[1]}</span>
				</div>
				<div class="grid-product__meta">
					<div class="grid-product__title grid-product__title--body">${item.title}</div>
					<div class="grid-product__price">${price()}<span class="tax-notice">（税込）</span></div>
				</div>
			</a>
		</div>
		`;
		const check = SFA.cookie? SFA.cookie.fav_items.filter(i => decodeURI(i) == item.handle): [];

		const wrapper = SFA.creat.element('div', {'dataset.id': item.handle});
		wrapper.classList.add('_SFA');
		SFA.creat.button(wrapper, {bool: true, checked: !!check.length});

		container.appendChild(wrapper);
		return container;
	}
}