---
title: essays
layout: base.njk
---
{% for essay in collections.essays %}
- [{{essay.data.title}}]({{essay.url}}) {{essay.data.dateString}}
{% endfor %}