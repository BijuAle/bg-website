---
title: Essays
layout: base.njk
---

# {{title}}
{% for essay in collections.essays %}
- [{{essay.data.title}}]({{essay.url}}) {{essay.data.dateString}}
{% endfor %}