for img in *; do
convert -strip -interlace Plane -gaussian-blur 0.05 -quality 85% ${img} c_${img}
done