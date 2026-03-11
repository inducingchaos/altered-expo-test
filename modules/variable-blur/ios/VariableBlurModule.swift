import ExpoModulesCore

public class VariableBlurModule: Module {
  public func definition() -> ModuleDefinition {
    Name("VariableBlur")

    View(VariableBlurUIView.self) {
      Prop("maxBlurRadius") { (view: VariableBlurUIView, radius: Double) in
        view.maxBlurRadius = CGFloat(radius)
        view.applyVariableBlur()
      }

      Prop("startOffset") { (view: VariableBlurUIView, offset: Double) in
        view.startOffset = CGFloat(offset)
        view.applyVariableBlur()
      }

      Prop("direction") { (view: VariableBlurUIView, rawDirection: String) in
        if rawDirection == "blurredBottomClearTop" {
          view.direction = .blurredBottomClearTop
        } else {
          view.direction = .blurredTopClearBottom
        }
        view.applyVariableBlur()
      }
    }
  }
}
