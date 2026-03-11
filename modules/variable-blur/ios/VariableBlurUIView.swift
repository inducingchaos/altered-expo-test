import UIKit
import CoreImage.CIFilterBuiltins
import QuartzCore

public enum VariableBlurDirection {
  case blurredTopClearBottom
  case blurredBottomClearTop
}

open class VariableBlurUIView: UIVisualEffectView {
  public var maxBlurRadius: CGFloat
  public var direction: VariableBlurDirection
  public var startOffset: CGFloat

  public init(
    maxBlurRadius: CGFloat = 20,
    direction: VariableBlurDirection = .blurredTopClearBottom,
    startOffset: CGFloat = 0
  ) {
    self.maxBlurRadius = maxBlurRadius
    self.direction = direction
    self.startOffset = startOffset

    super.init(effect: UIBlurEffect(style: .regular))
    applyVariableBlur()
  }

  required public init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  open override func didMoveToWindow() {
    guard let window, let backdropLayer = subviews.first?.layer else { return }
    backdropLayer.setValue(window.traitCollection.displayScale, forKey: "scale")
  }

  open override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
    // Calling super here can crash on some iOS versions for this private-filter setup.
  }

  func applyVariableBlur() {
    let clsName = String("retliFAC".reversed())
    guard let Cls = NSClassFromString(clsName) as? NSObject.Type else {
      print("[VariableBlur] Error: Can't find filter class")
      return
    }

    let selName = String(":epyThtiWretlif".reversed())
    guard let variableBlur = Cls.self.perform(NSSelectorFromString(selName), with: "variableBlur")?.takeUnretainedValue() as? NSObject else {
      print("[VariableBlur] Error: Can't create variableBlur filter")
      return
    }

    let gradientImage = makeGradientImage(startOffset: startOffset, direction: direction)

    variableBlur.setValue(maxBlurRadius, forKey: "inputRadius")
    variableBlur.setValue(gradientImage, forKey: "inputMaskImage")
    variableBlur.setValue(true, forKey: "inputNormalizeEdges")

    let backdropLayer = subviews.first?.layer
    backdropLayer?.filters = [variableBlur]

    for subview in subviews.dropFirst() {
      subview.alpha = 0
    }
  }

  private func makeGradientImage(
    width: CGFloat = 100,
    height: CGFloat = 100,
    startOffset: CGFloat,
    direction: VariableBlurDirection
  ) -> CGImage {
    let ciGradientFilter = CIFilter.linearGradient()
    ciGradientFilter.color0 = CIColor.black
    ciGradientFilter.color1 = CIColor.clear
    ciGradientFilter.point0 = CGPoint(x: 0, y: height)
    ciGradientFilter.point1 = CGPoint(x: 0, y: startOffset * height)

    if case .blurredBottomClearTop = direction {
      ciGradientFilter.point0.y = 0
      ciGradientFilter.point1.y = height - ciGradientFilter.point1.y
    }

    return CIContext().createCGImage(
      ciGradientFilter.outputImage!,
      from: CGRect(x: 0, y: 0, width: width, height: height)
    )!
  }
}
