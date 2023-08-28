---
title: Essays
layout: base.njk
---

# {{title}}

A collection of my written musings and publications on environment and society.

{% for essay in collections.essays %}
- [{{essay.data.title}}]({{essay.url}}) {{essay.data.dateString}}
{% endfor %}