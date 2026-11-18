# Промты для иллюстраций

Три картинки в одном стиле. Формат PNG, квадрат 1200×1200, чисто белый фон.
Сохранять в `public/images/` под указанными именами — на сайте они появятся сами, код менять не нужно.

Главное для единого стиля: генерировать все три в одном чате или с одним и тем же референсом, чтобы персонаж и линии совпадали.

## Общий стиль (добавлять в конец каждого промта)

```
Style: flat vector illustration with hand-drawn black outlines of uneven thickness, doodle sketch feel, simple friendly cartoon character with a small dot eyes and a smile, minimal details. Strict limited palette: electric violet #5546FF, soft lavender #ECEBFF, lime green #C9F45C, white, black outlines; skin left white. A large soft lavender blob shape behind the scene. Small doodle accents around: sparkles, short dashes, a light bulb. Pure white background #FFFFFF, generous empty margin, no text, no letters, no numbers, no logos, no watermark.
```

## 1. `hero.png` — первый экран

```
A young person with curly black hair in a violet sweater sits at a desk with an open laptop and thinks about a puzzle. Above the laptop floats a large speech-bubble-shaped card showing a 3x3 grid of simple geometric shapes: circles, squares and triangles, with the last cell marked by a lime question mark tile. A lime light bulb doodle glows near the person's head.
```

## 2. `advantages.png` — блок «Наши преимущества»

```
A large smartphone standing upright, on its screen a simple quiz interface: a row of four small square tiles and one lime tile with a question mark, and two violet gears at the bottom. Next to the phone, inside a lavender circle, the same young person with curly black hair in a violet sweater points one finger up with a confident smile. A small stack of two books and a potted plant stand beside the phone.
```

## 3. `cta.png` — финальный блок

```
The same young person with curly black hair in a violet sweater stands happily with one fist raised in celebration, holding in the other hand a sheet of paper with a simple bell curve chart and a lime circle marker on it. A lime star and a thumbs-up doodle float nearby.
```

---

# Картинки для экранов поддержки в тесте

Три экрана появляются после 5-го, 10-го и 15-го ответа. Формат тот же: PNG, квадрат 1200×1200, чисто белый фон, тот же персонаж и тот же общий стиль (блок «Общий стиль» выше добавлять в конец каждого промта).

Сохранять в `public/images/`. Пока файлов нет, экраны показываются без картинок.

## 4. `boost-speed.png` — после 5 вопросов, «вы отвечаете быстрее»

```
The same young person with curly black hair in a violet sweater runs forward energetically, leaning into the run, with short motion dashes behind them. A large lime lightning bolt floats above, and a violet stopwatch with a lime hand floats beside the character.
```

## 5. `boost-focus.png` — после 10 вопросов, «вы держите концентрацию»

```
The same young person with curly black hair in a violet sweater sits calmly cross-legged with eyes closed and a small smile, hands resting on knees. Above their head floats a large violet target with a lime bullseye and an arrow in the exact center. Small lime sparkles around.
```

## 6. `boost-finish.png` — после 15 вопросов, «финишная прямая»

```
The same young person with curly black hair in a violet sweater reaches forward with one hand toward a finish flag on a pole, the flag is lime with a violet checkered pattern. A violet rocket with a lime flame flies upward beside the character. Short motion dashes show speed.
```
